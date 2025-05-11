export class MapScene extends Phaser.Scene {
  
    constructor() {
      super("MapScene");
    }

    private player: Phaser.GameObjects.Image;
    private tileLocations: Map<number, { cx: number, cy: number, r: number }> = new Map();

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

      // Add video to the bottom-left corner of the mapContainer
      const video = this.add.video(50, bg.height - 50, 'dice6').setOrigin(0.5);
      video.setDisplaySize(64, 64); // Set the display size to 64x64 pixels
      video.play(false); // Play the video once, without looping
      mapContainer.add(video);

      // Parse the CSV data after it's loaded
      this.parseTileLocations();

      this.movePlayerTo(3);
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
    movePlayerTo(xOrTile: number, y?: number) {
      if (y !== undefined) {
        // If y is provided, treat xOrTile as x coordinate
        this.player.setPosition(xOrTile, y);
        console.log(`Player moved to (${xOrTile}, ${y})`);
      } else {
        // Treat xOrTile as tile number and look up coordinates
        const tileData = this.tileLocations.get(xOrTile);
        if (tileData) {
          this.player.setPosition(tileData.cx, tileData.cy);
          console.log(`Player moved to tile ${xOrTile} at (${tileData.cx}, ${tileData.cy})`);
        } else {
          console.error(`Tile number ${xOrTile} not found in tile locations`);
        }
      }
    }
  }
  
