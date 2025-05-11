export class MapScene extends Phaser.Scene {
  
    constructor() {
      super("MapScene");
    }

    private player: Phaser.GameObjects.Image;
    private tileLocations: Map<number, { cx: number, cy: number, r: number }> = new Map();
    private socket: any; // You'll need to integrate socket.io client
    private gameId: string = 'TEST_GAME'; // This should be set based on actual game ID
    private playerId: number = 1; // This should be set based on actual player ID
    private turnOrder: number[] = [];
    private currentPlayerTurn: number = -1;
    private playerInitialRolls: Map<number, number> = new Map();
    private playerSprites: Map<number, Phaser.GameObjects.Image> = new Map();

    preload() {
      this.load.setBaseURL('http://localhost:3000');          
      this.load.setPath('assets');       
      
      this.load.image('backgroundMap', encodeURIComponent('board/background.png'));   

      this.load.svg('mapOverlay', encodeURIComponent('board/Board with Bridges.svg'), {
        width: 1920,
        height: 1080
      });

      this.load.svg('player', encodeURIComponent('character_asset/solsticeFront.svg'), {
        width: 64,
        height: 64
      });

      // Load the tile locations CSV file
      this.load.text('tileLocations', encodeURIComponent('board/tilesLocation.csv'));
      
      // Load the dice video
      this.load.video('dice6', encodeURIComponent('dice/dice6.mp4'), 'loadeddata', false, true);
    }
  
    create() {
      // … your existing background + overlay code …
      const bg = this.add.image(0, 0, 'backgroundMap').setOrigin(0);
      const overlay = this.add.image(0, 0, 'mapOverlay').setOrigin(0).setDisplaySize(bg.width, bg.height);
      this.player = this.add.image(1683, 991, 'player').setOrigin(0.5, 0.5);
      
      const mapContainer = this.add.container(0, 0, [bg, overlay, this.player]);

      // Add video to the bottom-left corner of the mapContainer for dice rolling
      const video = this.add.video(50, bg.height - 50, 'dice6').setOrigin(0.5);
      video.setDisplaySize(64, 64); // Set the display size to 64x64 pixels
      video.setVisible(false); // Start hidden
      mapContainer.add(video);
      
      // Fade out the video after it finishes playing
      video.on('complete', () => {
        this.tweens.add({
          targets: video,
          alpha: 0, // Fade to completely transparent
          duration: 1000, // Duration of the fade in milliseconds (1 second)
          ease: 'Power1', // Easing function for a smooth fade
          onComplete: () => {
            video.setVisible(false); // Hide the video after fade out
          }
        });
      });

      // Parse the CSV data after it's loaded
      this.parseTileLocations();

      this.movePlayerTo(3);
      
      // Setup socket listeners for multiplayer functionality
      // Note: You'll need to properly initialize the socket connection
      this.setupSocketListeners();
    }

    // Parse the CSV file and store tile locations in a map
    private parseTileLocations() {
      const csvData = this.cache.text.get('tileLocations') as string;
      if (!csvData) {
        console.error('Failed to load tile locations CSV file');
        return;
      }

      const lines = csvData.split('\n');
      // Skip the header line if it exists
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line) {
          const [id, cx, cy, r] = line.split(',').map(value => parseFloat(value));
          if (!isNaN(id) && !isNaN(cx) && !isNaN(cy)) {
            this.tileLocations.set(id, { cx, cy, r });
          }
        }
      }
      console.log('Tile locations loaded:', this.tileLocations);
    }

    // Move the player to the specified coordinates or tile number
    movePlayerTo(xOrTile: number, y?: number, playerId: number = this.playerId) {
      let targetSprite = this.playerSprites.get(playerId);
      if (!targetSprite) {
        // Create a sprite for this player if it doesn't exist
        targetSprite = this.add.image(1683, 991, 'player').setOrigin(0.5, 0.5);
        this.playerSprites.set(playerId, targetSprite);
        console.log(`Created sprite for player ${playerId}`);
      }
      
      if (y !== undefined) {
        // If y is provided, treat xOrTile as x coordinate
        targetSprite.setPosition(xOrTile, y);
        console.log(`Player ${playerId} moved to (${xOrTile}, ${y})`);
      } else {
        // Treat xOrTile as tile number and look up coordinates
        const tileData = this.tileLocations.get(xOrTile);
        if (tileData) {
          targetSprite.setPosition(tileData.cx, tileData.cy);
          console.log(`Player ${playerId} moved to tile ${xOrTile} at (${tileData.cx}, ${tileData.cy})`);
        } else {
          console.error(`Tile number ${xOrTile} not found in tile locations for player ${playerId}`);
        }
      }
    }
    
    // Play dice roll animation
    playDiceRollAnimation(rollResult: number, onComplete?: () => void) {
      const video = this.children.list.find(child => child.type === 'Video') as Phaser.GameObjects.Video;
      if (video) {
        video.setAlpha(1);
        video.setVisible(true);
        video.play(false);
        // You might want to adjust the video to stop at a specific frame based on rollResult
        console.log(`Playing dice roll animation, result: ${rollResult}`);
        video.on('complete', () => {
          this.tweens.add({
            targets: video,
            alpha: 0,
            duration: 1000,
            ease: 'Power1',
            onComplete: () => {
              video.setVisible(false);
              if (onComplete) onComplete();
            }
          });
        });
      } else {
        console.error('Dice video not found');
        if (onComplete) onComplete();
      }
    }
    
    // Setup socket listeners for multiplayer events
    private setupSocketListeners() {
      // This is a placeholder. You'll need to properly initialize socket.io client.
      // For now, assuming 'socket' is available.
      // You might need to use: this.socket = io('http://localhost:3000');
      
      // Listen for player joined event with initial roll
      if (this.socket) {
        this.socket.on('playerJoined', (data: { playerId: number, initialRoll: number }) => {
          console.log(`Player ${data.playerId} joined with initial roll ${data.initialRoll}`);
          this.playerInitialRolls.set(data.playerId, data.initialRoll);
          // Update UI to show player and their roll
          // Create sprite for new player if needed
          if (!this.playerSprites.has(data.playerId)) {
            const newPlayerSprite = this.add.image(1683, 991, 'player').setOrigin(0.5, 0.5);
            this.playerSprites.set(data.playerId, newPlayerSprite);
            console.log(`Created sprite for player ${data.playerId}`);
          }
        });
        
        // Listen for game started event with turn order
        this.socket.on('gameStarted', (data: { turnOrder: number[], currentPlayer: number }) => {
          console.log(`Game started with turn order: ${data.turnOrder}`);
          this.turnOrder = data.turnOrder;
          this.currentPlayerTurn = data.currentPlayer;
          // Update UI to show turn order
          // If it's this player's turn, prompt for actions
          if (this.currentPlayerTurn === this.playerId) {
            console.log("It's your turn! Roll the dice!");
            // Show UI button or prompt to roll dice
          }
        });
        
        // Listen for turn advanced event
        this.socket.on('turnAdvanced', (data: { currentPlayer: number }) => {
          console.log(`Turn advanced to player ${data.currentPlayer}`);
          this.currentPlayerTurn = data.currentPlayer;
          // Update UI to highlight current player
          // If it's this player's turn, prompt for actions
          if (this.currentPlayerTurn === this.playerId) {
            console.log("It's your turn! Roll the dice!");
            // Show UI button or prompt to roll dice
          }
        });
        
        // Listen for player moved event
        this.socket.on('playerMoved', (data: { playerId: number, position: number, roll?: number }) => {
          console.log(`Player ${data.playerId} moved to position ${data.position}`);
          this.movePlayerTo(data.position, undefined, data.playerId);
          // If a roll value is provided (from dice roll), play animation
          if (data.roll && data.playerId === this.playerId) {
            this.playDiceRollAnimation(data.roll);
          }
        });
      } else {
        console.error('Socket not initialized');
      }
    }
    
    // Request to roll dice for movement
    requestDiceRoll() {
      if (this.currentPlayerTurn === this.playerId) {
        console.log('Requesting dice roll for movement');
        this.socket.emit('movePlayerDiceRoll', this.gameId, this.playerId);
      } else {
        console.log('Cannot roll dice: not your turn');
      }
    }
    
    // Request to end turn
    endTurn() {
      if (this.currentPlayerTurn === this.playerId) {
        console.log('Ending turn');
        this.socket.emit('endTurn', this.gameId);
      } else {
        console.log('Cannot end turn: not your turn');
      }
    }
  }
  
