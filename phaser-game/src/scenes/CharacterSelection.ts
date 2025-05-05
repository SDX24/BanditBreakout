import Phaser from "phaser";
export class CharacterSelection extends Phaser.Scene {
  private overlayBacking!: Phaser.GameObjects.Image;
  private overlayFrame!: Phaser.GameObjects.Image;
  private overlayPage!: Phaser.GameObjects.Image;
  private overlayBackSign!: Phaser.GameObjects.Image;


  constructor() {
    super("CharacterSelection");
  }

  preload() {
    this.load.image("overlayBacking", "tempAssets/backing.png");
    this.load.image("overlayFrame", "tempAssets/frame.png");
    this.load.image("overlayPage", "tempAssets/page.png");
    this.load.image("ovelayBackSign", "tempAssets/backSign.png");
  }

  create() {
    //screen
    const screen = this.add.container(0, 0);

    const background = this.add.graphics().fillStyle(0x573912).fillRect(0, 0, 1920, 1080);
    screen.add(background);

    const overlayBackSign = this.add.image(0, 0, "ovelayBackSign");
    screen.add(overlayBackSign);

    const containerMain = this.add.container(960, 540);
    screen.add(containerMain);

    //containerMain
    const overlayBackground = this.add.image(0, 0, "overlayBacking");
    containerMain.add(overlayBackground);

    const overlayFrame = this.add.image(-450, 0, "overlayFrame");
    containerMain.add(overlayFrame);

    const overlayPage = this.add.image(450, 0, "overlayPage");
    containerMain.add(overlayPage);

    //containerBottom
    const containerBottom = this.add.container(960, 980);
    screen.add(containerBottom);

    const containerCharIcon = this.add.container(0, 0);
    containerBottom.add(containerCharIcon);

    const charCircle = this.add.graphics().fillStyle(0xB7B7B7).fillCircle(0, 0, 100)
    charCircle.setScale(0.7);
    containerCharIcon.add(charCircle);



  }
}