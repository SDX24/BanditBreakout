import Phaser from "phaser";
import WebFontLoader from "webfontloader";

export class MainScreen extends Phaser.Scene {
  private background!: Phaser.GameObjects.Image;
  private pole!: Phaser.GameObjects.Image;
  private titleCard!: Phaser.GameObjects.Image;
  private start!: Phaser.GameObjects.Image;
  private options!: Phaser.GameObjects.Image;
  private quit!: Phaser.GameObjects.Image;

  constructor() {
    super("MainScreen");
  }

  preload() {
    this.load.image("background", "assets/background.png");
    this.load.image("pole", "assets/pole.png");
    this.load.image("title-card", "assets/title card.png");
    this.load.image("start", "assets/start.png");
    this.load.image("options", "assets/options.png");
    this.load.image("quit", "assets/quit.png");

    WebFontLoader.load({
      custom: {
        families: ["Wellfleet", "WBB"],
        urls: ["/fonts.css"],
      },
    });
  }

  create() {
    const screen = this.add.container(0, 0);

    const background = this.add.image(960, 540, "background");
    screen.add(background);

    const optionsContainer = this.add.container(0, 0);
    const options = this.add.image(960, 540, "options");
    const optionsText = this.add.text(570, 805, "Settings", {
      fontFamily: "WBB",
      fontSize: 120,
      color: "#492807",
    });
    optionsContainer.add(options);
    optionsContainer.add(optionsText);

    const poleContainer = this.add.container(0, 0);
    const pole = this.add.image(860, 540, "pole");
    pole.setDisplaySize(1600, 1080);
    poleContainer.add(pole);

    const titleContainer = this.add.container(0, 0);
    const titleCard = this.add.image(960, 540, "title-card");
    titleCard.setDisplaySize(1920, 1000);
    titleContainer.add(titleCard);
    const titleCardText = this.add.text(450, 190, "Bandit Breakout", {
      fontFamily: "WBB",
      fontSize: 250,
      color: "#492807",
    });
    titleContainer.add(titleCardText);

    const start = this.add.image(940, 540, "start");
    const startText = this.add.text(550, 670, "Start", {
      fontFamily: "WBB",
      fontSize: 100,
      color: "#492807",
    });
    titleContainer.add(start);
    titleContainer.add(startText);

    const quit = this.add.image(940, 540, "quit");
    const quitText = this.add.text(120, 910, "Quit", {
      fontFamily: "WBB",
      fontSize: 120,
      color: "#492807",
    });

    titleContainer.add(quit);
    titleContainer.add(quitText);
  }
}
