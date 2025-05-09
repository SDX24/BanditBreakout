import Phaser from "phaser";
import WebFontLoader from "webfontloader";

export class LoadingScreen extends Phaser.Scene {
  private loadingScene!: Phaser.GameObjects.Video;

  constructor() {
    super("LoadingScreen");
  }

  preload() {
    this.load.video("loading", "assets/Loading Screen.mp4");
  }

  create() {
    const screen = this.add.container(0, 0);
    const loadingScene = this.add.video(960, 540, "loading");

    loadingScene.play(true);
    screen.add(loadingScene);
  }
}
