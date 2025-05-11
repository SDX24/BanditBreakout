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

      this.load.svg('player', encodeURIComponent('character_asset/solsticeFront.svg'), {
        width: 64,
        height: 64
      });

      

      


    }
  
    create() {
      // … your existing background + overlay code …
      const bg      = this.add.image(0,0,'backgroundMap').setOrigin(0);
      const overlay = this.add.image(0,0,'mapOverlay').setOrigin(0).setDisplaySize(bg.width, bg.height);
      //set player original position to 1683,991 ai!
      const player  = this.add.image(0,0,'player').setOrigin(1683, 991);
      
      const mapContainer = this.add.container(0,0,[ bg, overlay, player ]);

    }
  }
  
