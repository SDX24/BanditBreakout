export class MapScene extends Phaser.Scene {
    private mapContainer!: Phaser.GameObjects.Container;
    private isDragging  = false;
    private dragStartX  = 0;
    private dragStartY  = 0;
  
    preload() {
      this.load.image('background', 'tempAssets/background.png');
      this.load.image('mapOverlay','tempAssets/Game Board.svg');
    }
  
    create() {
      // … your existing background + overlay code …
      const bg      = this.add.image(0,0,'background').setOrigin(0);
      const overlay = this.add.image(0,0,'mapOverlay').setOrigin(0);
  
      this.mapContainer = this.add.container(0,0,[ bg, overlay ]);
  
      this.cameras.main
        .setBounds(0,0,bg.width,bg.height)
        .startFollow(this.mapContainer)
        .setZoom(1);
  
      // ① on down: begin drag and remember start pos
      this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
        this.isDragging = true;
        this.dragStartX = pointer.x;
        this.dragStartY = pointer.y;
      });
  
      // ② on up: end drag
      this.input.on('pointerup', () => {
        this.isDragging = false;
      });
  
      // ③ on move: if dragging, pan camera by the delta
      this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
        if (!this.isDragging) return;
  
        const cam = this.cameras.main;
        // how much the pointer moved since last event
        const dx = pointer.x - this.dragStartX;
        const dy = pointer.y - this.dragStartY;
  
        // move camera *against* the drag so the world follows your finger
        cam.scrollX -= dx / cam.zoom;
        cam.scrollY -= dy / cam.zoom;
  
        // update for next move
        this.dragStartX = pointer.x;
        this.dragStartY = pointer.y;
      });
    }
  }
  