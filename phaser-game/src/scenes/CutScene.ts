import Phaser from "phaser";
import WebFontLoader from "webfontloader";
import skipTo from "../middleware/skipWithEscSpace";

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

    cutScene.play(false);
    screen.add(cutScene);

    skipTo(this, 'LoadingScreen', () => {
      cutScene.stop();
      cutScene.destroy();
    });
  }
}

