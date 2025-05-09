import skipTo from "../middleware/skipWithEscSpace";
import WebFontLoader from "webfontloader";

export class LoadingScreen extends Phaser.Scene {

  constructor() {
    super("LoadingScreen");
  }

  preload() {
    this.load.video("loading", "assets/Loading Screen.mp4");
  }

  create() {
    const screen = this.add.container(0, 0);
    const loadingScreen = this.add.video(960, 540, "loading");

    loadingScreen.play(true);
    screen.add(loadingScreen);


        skipTo(this, 'MainScreen', () => {
        });
  }
}
