import Phaser from "phaser";
import WebFontLoader from "webfontloader";

export class CutScene extends Phaser.Scene {
  private loadingScene!: Phaser.GameObjects.Video;

  constructor() {
    super("CutScene");
  }

  preload() {
    this.load.video("cut-scene", "assets/fullcutscenewithaudio.mp4");
  }

  create() {
    const screen = this.add.container(0, 0);
    const cutScene = this.add.video(960, 540, "cut-scene");

    cutScene.play(true);
    screen.add(cutScene);
    //skip on ESC and SPACE
    this.input.keyboard!.on('keydown-ESC', (event: Event) => {
      event.preventDefault();
      this.scene.launch('MainScreen')
  });
    this.input.keyboard!.on('keydown-SPACE', (event: Event) => {
      event.preventDefault();
      this.scene.launch('MainScreen')
  });

  }
}

