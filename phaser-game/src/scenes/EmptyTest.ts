import Phaser from "phaser";
import settingsListener from "../middleware/settingsListener";

export class EmptyTest extends Phaser.Scene {

  constructor() {
    super("EmptyTest");
  }

  preload() {
    
      this.load.video(`dice1`, "tempAssets/dice/dice1.mp4");
    
  }

  create() {
    


    const screen = this.add.container(0, 0);
    // add background red
    const backgroundRed = this.add.graphics().fillStyle(0xff0000).fillRect(0, 0, 1920, 1080);
    const cutScene = this.add.video(960, 540, "dice1");
    const maskShape = this.make.graphics({ x: 960, y: 540});
        maskShape.fillStyle(0xffffff);
        maskShape.fillRoundedRect(-195, -245, 390, 370, 72);
        const mask = maskShape.createGeometryMask();
        cutScene.setMask(mask);

    cutScene.play(true);
    screen.add(backgroundRed);
    screen.add(cutScene);
  
}
}