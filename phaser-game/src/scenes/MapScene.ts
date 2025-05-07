export class MapScene extends Phaser.Scene {
    private mapContainer!: Phaser.GameObjects.Container;
    private isDragging  = false;
    private dragStartX  = 0;
    private dragStartY  = 0;
  
    preload() {
      this.load.image('background', 'tempAssets/background.png');
      this.load.svg('mapOverlay','tempAssets/Board with Bridges.svg', {
        width: 1920,
        height: 1080
    });



    }
  
    create() {
      // … your existing background + overlay code …
      const bg      = this.add.image(0,0,'background').setOrigin(0);
      const overlay = this.add.image(0,0,'mapOverlay').setOrigin(0).setDisplaySize(bg.width, bg.height);
 
      this.mapContainer = this.add.container(0,0,[ bg, overlay ]);
  
    }
  }
  
