import Phaser from "phaser";
export class EmptyTest extends Phaser.Scene {

  constructor() {
    super("EmptyTest");
  }

  preload() {
    this.load.image("backgroundBoard", "tempAssets/background.png");
    this.load.image("bridgeBoard", "tempAssets/bridge.png");
    this.load.svg("Game_Board", "tempassets/Game Board.svg", {
        width: 1920,
        height: 1080
    });
  }

  create() {
    // 960, 540 is the middle of the screen since our resolution is 1920x1080 (halfs of resolution)
    const boardContainer = this.add.container(960, 540);
    const backgroundBoard = this.add.image(0, 0, "backgroundBoard");
    const bridgeBoard1 = this.add.image(30, -20, "bridgeBoard");
    const gameBoard = this.add.image(0, 0, "Game_Board")
    bridgeBoard1
    .setDisplaySize(bridgeBoard1.width * 0.1, bridgeBoard1.height * 0.1)
    .setRotation(-0.2)
    const bridgeBoard2 = this.add.image(50, 250, "bridgeBoard");
    bridgeBoard2.setDisplaySize(bridgeBoard2.width * 0.15, bridgeBoard2.height * 0.15).setRotation(-0.05)

    // container adds are added in order, so they go from furthest back to closest to the camera
    // thats why bridges are behind gameBoard (tiles)
    boardContainer.add([backgroundBoard, bridgeBoard1, bridgeBoard2, gameBoard]);
  }
}


