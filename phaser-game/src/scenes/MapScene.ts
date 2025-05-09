export class MapScene extends Phaser.Scene {
  
    constructor() {
      super("MapScene");
    }

    preload() {

      this.load.setBaseURL('http://localhost:3000');          
      this.load.setPath('assets');       
      
      this.load.image('backgroundMap', encodeURIComponent('board/background.png'));   

      this.load.svg('mapOverlay', encodeURIComponent('board/Board with Bridges.svg'), {
        width: 1920,
        height: 1080
      });

    }
  
    create() {
      // … your existing background + overlay code …
      const bg      = this.add.image(0,0,'backgroundMap').setOrigin(0);
      const overlay = this.add.image(0,0,'mapOverlay').setOrigin(0).setDisplaySize(bg.width, bg.height);
 
      const mapContainer = this.add.container(0,0,[ bg, overlay ]);

    }
  }
  
