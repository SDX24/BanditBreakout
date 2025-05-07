import Phaser from "phaser";
import WebFontLoader from "webfontloader";

export class Room extends Phaser.Scene {
  private background!: Phaser.GameObjects.Image;
  private post!: Phaser.GameObjects.Image;
  private host!: Phaser.GameObjects.Image;
  private code!: Phaser.GameObjects.Image;
  private backSign!: Phaser.GameObjects.Image;
  private lobby!: Phaser.GameObjects.Image;
  private playericon!: Phaser.GameObjects.Image;

  constructor() {
    super("Room");
  }

  preload() {
    this.load.image("background", "assets/background.png");
    this.load.image("post", "assets/post.png");
    this.load.image("host", "assets/host.png");
    this.load.image("code", "assets/code.png");
    this.load.image("back-sign", "assets/options.png");
    this.load.image("start", "assets/host.png");
    this.load.image("lobby", "assets/lobby.png");
    this.load.svg("playericon", "assets/player icon.svg");

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

    const postContainer = this.add.container(0, 0);
    postContainer.setPosition(-470, 0);
    const post = this.add.image(850, 620, "post");
    postContainer.add(post);

    const backSign = this.add.image(350, -220, "back-sign");
    const backSignText = this.add.text(100, 50, "Back", {
      fontFamily: "WBB",
      fontSize: 120,
      color: "#492807",
    });

    const host = this.add.image(960, 400, "host");
    host.setDisplaySize(890, 290);
    const hostText = this.add.text(770, 300, "Code:", {
      fontFamily: "WBB",
      fontSize: 250,
      color: "#492807",
    });
    postContainer.add(host);
    postContainer.add(hostText);

    const code = this.add.image(960, 700, "code");
    code.setDisplaySize(890, 290);
    code.setFlipX(true);
    const codeText = this.add.text(600, 620, "_ _ _ _ _ _", {
      fontFamily: "WBB",
      fontSize: 150,
      color: "#492807",
    });
    postContainer.add(code);
    postContainer.add(codeText);

    const start = this.add.image(960, 950, "start");
    start.setDisplaySize(500, 200);
    const startText = this.add.text(840, 890, "Start", {
      fontFamily: "WBB",
      fontSize: 150,
      color: "#492807",
    });
    postContainer.add(start);
    postContainer.add(startText);

    const lobbyContainer = this.add.container(0, 0);
    const lobby = this.add.image(1400, 650, "lobby");
    lobby.setDisplaySize(650, 750);
    const lobbyText = this.add.text(1260, 340, "Wanted", {
      fontFamily: "WBB",
      fontSize: 130,
      color: "#492807",
    });
    lobbyContainer.add(lobby);
    lobbyContainer.add(lobbyText);

    const playericonContainer = this.add.container(0, 0);

    const playericonContainter1 = this.add.container(0, 0);
    const playericon1 = this.add.image(1270, 550, "playericon");
    const playericon1Text = this.add.text(1245, 600, "P1", {
      fontFamily: "WBB",
      fontSize: 60,
      color: "#492807",
    });
    playericonContainter1.add(playericon1);
    playericonContainter1.add(playericon1Text);

    const playericonContainter2 = this.add.container(0, 0);
    const playericon2 = this.add.image(1270, 710, "playericon");
    const playericon2Text = this.add.text(1245, 760, "P2", {
      fontFamily: "WBB",
      fontSize: 60,
      color: "#492807",
    });
    playericonContainter2.add(playericon2);
    playericonContainter2.add(playericon2Text);

    const playericonContainter3 = this.add.container(0, 0);
    const playericon3 = this.add.image(1270, 870, "playericon");
    const playericon3Text = this.add.text(1245, 920, "P3", {
      fontFamily: "WBB",
      fontSize: 60,
      color: "#492807",
    });
    playericonContainter3.add(playericon3);
    playericonContainter3.add(playericon3Text);

    const playericonContainter4 = this.add.container(0, 0);
    const playericon4 = this.add.image(1500, 550, "playericon");
    const playericon4Text = this.add.text(1475, 600, "P4", {
      fontFamily: "WBB",
      fontSize: 60,
      color: "#492807",
    });
    playericonContainter4.add(playericon4);
    playericonContainter4.add(playericon4Text);

    const playericonContainter5 = this.add.container(0, 0);
    const playericon5 = this.add.image(1500, 710, "playericon");
    const playericon5Text = this.add.text(1475, 760, "P5", {
      fontFamily: "WBB",
      fontSize: 60,
      color: "#492807",
    });
    playericonContainter5.add(playericon5);
    playericonContainter5.add(playericon5Text);

    playericonContainer.add([
      playericonContainter1,
      playericonContainter2,
      playericonContainter3,
      playericonContainter4,
      playericonContainter5,
    ]);
  }
}
