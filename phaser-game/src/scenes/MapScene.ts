import { io, Socket } from 'socket.io-client';

export class MapScene extends Phaser.Scene {
  
    constructor() {
      super("MapScene");
      const storedPlayerId = localStorage.getItem('playerId');
      if (storedPlayerId) {
        this.playerId = parseInt(storedPlayerId, 10);
        console.log(`Using stored playerId: ${this.playerId}`);
      } else {
        this.playerId = Math.floor(Math.random() * 1000) + 1;
        localStorage.setItem('playerId', this.playerId.toString());
        console.log(`Generated new playerId: ${this.playerId}`);
      }
    }

    private player: Phaser.GameObjects.Image;
    private tileLocations: Map<number, { cx: number, cy: number, r: number }> = new Map();
    private socket: any; // Socket.io client
    //TODO
    //private gameId: string = 'game_' + Math.floor(Math.random() * 10000).toString().padStart(4, '0'); // Generate a random game ID
    private gameId: string = 'game_multiple_user'; 
    private playerId: number;
    private turnOrder: number[] = [];
    private currentPlayerTurn: number = -1;
    private playerInitialRolls: Map<number, number> = new Map();
    private playerSprites: Map<number, Phaser.GameObjects.Image> = new Map();
    private diceVideos: Map<string, Phaser.GameObjects.Video> = new Map();

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
      
      // Load the dice videos with error handling
      console.log('Loading dice videos...');
      for (let i = 1; i <= 6; i++) {
        const key = `dice${i}`;
        this.load.video(key, encodeURIComponent(`dice/dice${i}.mp4`), 'loadeddata', false, true);
        this.load.on(`filecomplete-video-${key}`, () => {
          console.log(`Video ${key} loaded successfully`);
        });
        this.load.on(`fileerror-video-${key}`, (error: any) => {
          console.error(`Error loading video ${key}:`, error);
        });
      }
    }
  
    create() {
      // … your existing background + overlay code …
      const bg = this.add.image(0, 0, 'backgroundMap').setOrigin(0);
      const overlay = this.add.image(0, 0, 'mapOverlay').setOrigin(0).setDisplaySize(bg.width, bg.height);
      this.player = this.add.image(1683, 991, 'player').setOrigin(0.5, 0.5);
      
      // Add pulsing effect only (no tint)
      this.tweens.add({
        targets: this.player,
        scaleX: 1.2,
        scaleY: 1.2,
        yoyo: true, // Makes the tween go back and forth
        repeat: -1, // Repeat indefinitely
        duration: 1000, // Duration of one pulse cycle in milliseconds
        ease: 'Sine.easeInOut' // Smooth easing for the pulse
      });

      // Set depth to ensure the player sprite is above background and overlay
      this.player.setDepth(10);

      // const mapContainer = this.add.container(0, 0, [bg, overlay, this.player]);
      const mapContainer = this.add.container(0, 0, [bg, overlay]);

      // Add videos for each dice result to the bottom-left corner of the mapContainer
      for (let i = 1; i <= 6; i++) {
        const videoKey = `dice${i}`;
        const video = this.add.video(50, bg.height - 50, videoKey).setOrigin(0.5);
        video.setDisplaySize(64, 64); // Set the display size to 64x64 pixels
        video.setVisible(false); // Start hidden
        mapContainer.add(video);
        this.diceVideos.set(videoKey, video);
        console.log(`Dice video element created for ${videoKey}:`, video);
        
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
      }

      // Parse the CSV data after it's loaded
      this.parseTileLocations();

      // this.movePlayerTo(3);
      
      // Initialize socket connection
      this.initializeSocket();
      
      // Setup socket listeners for multiplayer functionality
      this.setupSocketListeners();
      
      // For testing: Add a button to start the game
      const startButton = this.add.text(100, 200, 'Start Game', { 
        fontSize: '32px', 
        backgroundColor: '#fff', 
        color: '#000', 
        padding: { x: 10, y: 5 }
      })
      .setInteractive()
      .on('pointerdown', () => {
        this.startGame();
        startButton.destroy(); // Remove the button after clicking
      });
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
        if (playerId === this.playerId) {
          targetSprite = this.player; // Use the pre-created player sprite with tint and pulse
        } else {
          // Create a new sprite for other players without any tint or pulse
          targetSprite = this.add.image(1683, 991, 'player').setOrigin(0.5, 0.5);
          // No tint or effects for other players
        }
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
      // Hide all dice videos first
      this.diceVideos.forEach(video => {
        video.setVisible(false);
        video.stop();
      });
      
      console.log(`rollResult: ${rollResult}`);
      // Select the appropriate video based on rollResult
      let videoKey = 'dice3'; // Default to dice6 if rollResult is unknown or 0
      if (rollResult >= 1 && rollResult <= 6) {
        videoKey = `dice${rollResult}`;
      }
      
      const videoToPlay = this.diceVideos.get(videoKey);
      if (videoToPlay) {
        videoToPlay.setAlpha(1);
        videoToPlay.setVisible(true);
        try {
          videoToPlay.play(false);
          console.log(`Playing dice roll animation for result: ${rollResult} using ${videoKey}`);
          // Ensure onComplete is called even if video playback doesn't trigger 'complete' event                                                                                                
          setTimeout(() => {                                                                                                                                                                    
            console.log(`Fallback timeout for video completion: ${videoKey}`);                                                                                                                  
            if (onComplete) onComplete();                                                                                                                                                       
          }, 3000); // Assume video should complete within 3 seconds            
        } catch (error) {
          console.error(`Error playing video ${videoKey}:`, error);
          // Fallback to just completing the action without animation
          if (onComplete) onComplete();
        }
      } else {
        console.error(`Dice video for ${videoKey} not found`);
        if (onComplete) onComplete();
      }
    }
    
    // Initialize socket connection
    private initializeSocket() {
      // Connect to the server
      this.socket = io('http://localhost:3000', {
        autoConnect: true
      });
      console.log('Socket initialized', this.socket);
      
      // Handle connection events
      this.socket.on('connect', () => {
        console.log('Connected to server');
        // Create a game first with only one player
        console.log(`Creating game with ID: ${this.gameId}`);
        this.socket.emit('createGame', this.gameId, 'Single Player Game', 2);
      });
      
      // Listen for game creation confirmation before joining
      this.socket.on('gameCreated', (data: { gameId: string, name: string }) => {
        console.log(`Game created: ${data.gameId} - ${data.name}`);
        // Now join the game after it's created
        console.log(`Joining game ${this.gameId} as player ${this.playerId}`);
        this.socket.emit('joinGame', this.gameId, this.playerId);
      });
      
      this.socket.on('disconnect', (reason) => {
        console.log(`Disconnected from server, reason: ${reason}`);
      });
      
      this.socket.on('error', (error: any) => {
        console.error('Socket error:', error);
      });
    }
    
    // Setup socket listeners for multiplayer events
    private setupSocketListeners() {
      if (this.socket) {
        // Listen for game state updates
        this.socket.on('gameState', (gameState: any) => {
          console.log('Received game state update:', gameState);
          
          // Update all player positions based on the game state
          gameState.players.forEach((playerData: any) => {
            const { id, position, status } = playerData;
            
            // Ensure a sprite exists for this player, but don't recreate if it exists
            if (!this.playerSprites.has(id)) {
              if (id === this.playerId) {
                this.playerSprites.set(id, this.player); // Use the existing tinted and pulsing sprite for local player
              } else {
                const newPlayerSprite = this.add.image(1683, 991, 'player').setOrigin(0.5, 0.5);
                // No tint for other players
                newPlayerSprite.setDepth(5); // Set depth lower than local player
                this.playerSprites.set(id, newPlayerSprite);
                console.log(`Created sprite for player ${id}`);
              }
            }
            
            // Move player to the correct position
            this.movePlayerTo(position, undefined, id);
            
            // Optionally, update UI elements related to player status (gold, health, effects)
            console.log(`Player ${id} status - Gold: ${status.gold}, Health: ${status.health}, Effects: ${status.effects}`);
            // TODO: Update UI elements for gold, health, and effects if needed
          });
          
          // Optionally, process tile information if needed for UI updates
          gameState.tiles.forEach((tileData: any) => {
            // TODO: Update tile UI if necessary, e.g., highlight tiles with events or players
            if (tileData.players.length > 0) {
              console.log(`Tile ${tileData.index} has players: ${tileData.players}, event type: ${tileData.eventType}`);
            }
          });
        });
        
        // Listen for player joined event with initial roll
        this.socket.on('playerJoined', (data: { playerId: number, initialRoll: number }) => {
          console.log(`Player ${data.playerId} joined with initial roll ${data.initialRoll}`);
          this.playerInitialRolls.set(data.playerId, data.initialRoll);
          // Update UI to show player and their roll
          // Create sprite for new player if needed, but don't recreate for local player
          if (!this.playerSprites.has(data.playerId)) {
            if (data.playerId === this.playerId) {
              this.playerSprites.set(data.playerId, this.player); // Use the existing tinted and pulsing sprite
            } else {
              const newPlayerSprite = this.add.image(1683, 991, 'player').setOrigin(0.5, 0.5);
              // No tint for other players
              newPlayerSprite.setDepth(5); // Set depth lower than local player
              this.playerSprites.set(data.playerId, newPlayerSprite);
              console.log(`Created sprite for player ${data.playerId}`);
            }
          }
        });
        
        // Listen for player disconnected event
        this.socket.on('playerDisconnected', (data: { playerId: number }) => {
          console.log(`Player ${data.playerId} disconnected`);
          // Remove the player's sprite if it exists
          const sprite = this.playerSprites.get(data.playerId);
          if (sprite) {
            sprite.destroy();
            this.playerSprites.delete(data.playerId);
          }
          // Remove player from turn order and initial rolls
          this.playerInitialRolls.delete(data.playerId);
          this.turnOrder = this.turnOrder.filter(id => id !== data.playerId);
        });
        
        // Listen for game started event with turn order
        this.socket.on('gameStarted', (data: { turnOrder: number[], currentPlayer: number }) => {
          console.log(`Game started with turn order: ${data.turnOrder}`);
          this.turnOrder = data.turnOrder;
          this.currentPlayerTurn = data.currentPlayer;
          // Update UI to show turn order and highlight next player
          this.updateNextPlayerEffect();
          // If it's this player's turn, prompt for actions
          if (this.currentPlayerTurn === this.playerId) {
            console.log("It's your turn! Roll the dice!");
            // Show UI button or prompt to roll dice
            this.showRollDiceButton();
          }
        });
        
        // Listen for turn advanced event
        this.socket.on('turnAdvanced', (data: { currentPlayer: number }) => {
          console.log(`Turn advanced to player ${data.currentPlayer}`);
          this.currentPlayerTurn = data.currentPlayer;
          // Update UI to highlight current player
          this.updateNextPlayerEffect();
          // If it's this player's turn, prompt for actions
          if (this.currentPlayerTurn === this.playerId) {
            console.log("It's your turn! Roll the dice!");
            // Show UI button or prompt to roll dice
            this.showRollDiceButton();
          }
        });
        
        // Listen for player moved event
        this.socket.on('playerMoved', (data: { playerId: number, position: number, roll?: number }) => {
          console.log(`Player ${data.playerId} moved to position ${data.position}, with roll is ${data.roll}`);
          if (data.roll) {
            // If a roll value is provided, play animation (or update if already playing)
            console.log(`Dice roll result: ${data.roll}`);
            console.log(`${data.playerId}, ${this.playerId}`);
            // Move player to new position after animation if it's the local player
            if (data.playerId === this.playerId) {
              this.playDiceRollAnimation(data.roll, () => {
                this.movePlayerTo(data.position, undefined, data.playerId);
                this.endTurn();
              });
            } else {
              this.movePlayerTo(data.position, undefined, data.playerId);
            }
          } else {
            this.movePlayerTo(data.position, undefined, data.playerId);
          }
        });
      } else {
        console.error('Socket not initialized');
      }
    }
    
    // Show roll dice button
    private showRollDiceButton() {
      // Create a simple button to roll the dice
      const button = this.add.text(100, 100, 'Roll Dice', { 
        fontSize: '32px', 
        backgroundColor: '#fff', 
        color: '#000', 
        padding: { x: 10, y: 5 }
      })
      .setInteractive()
      .on('pointerdown', () => {
        this.requestDiceRoll();
        button.destroy();
      });
    }
    
    // Update visual effect for the next player to move
    private updateNextPlayerEffect() {
      // Remove any existing effects from all players except the local player
      this.playerSprites.forEach((sprite, playerId) => {
        if (playerId !== this.playerId) {
          this.tweens.killTweensOf(sprite); // Stop any existing tweens for this sprite
          sprite.scaleX = 1; // Reset scale
          sprite.scaleY = 1;
          sprite.clearTint(); // Remove any tint
        }
      });
      
      // If the current player is not the local player, apply a red tint effect
      if (this.currentPlayerTurn !== this.playerId && this.currentPlayerTurn !== -1) {
        const nextPlayerSprite = this.playerSprites.get(this.currentPlayerTurn);
        if (nextPlayerSprite) {
          // Apply a red tint to indicate the current turn player
          nextPlayerSprite.setTint(0xFF0000); // Red tint
        }
      }
    }
    
    // Request to roll dice for movement
    requestDiceRoll() {
      if (this.currentPlayerTurn === this.playerId) {
        console.log('Requesting dice roll for movement');
        // Show dice roll animation immediately to give visual feedback
        // this.playDiceRollAnimation(0); // 0 as a placeholder since we don't know the result yet
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
    
    // For testing purposes, add a method to start the game
    startGame() {
      if (this.socket) {
        console.log(`Starting game ${this.gameId}`);
        this.socket.emit('startGame', this.gameId);
      } else {
        console.error('Cannot start game: socket not initialized');
      }
    }
  }
  
