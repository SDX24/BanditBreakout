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
    const titleCardText = this.add
      .text(450, 190, "Bandit Breakout", {
        fontFamily: "WBB",
        fontSize: 250,
        color: "#492807",
      })
      .setRotation(-0.03);
    titleContainer.add(titleCardText);

    const startContainer = this.add.container(940, 540);
    const start = this.add.image(0, 0, "start");
    const startText = this.add.text(-410, 130, "Start", {
      fontFamily: "WBB",
      fontSize: 100,
      color: "#492807",
    });
    startContainer.add([start, startText]);
    titleContainer.add(startContainer);

    const quit = this.add.image(940, 540, "quit");
    const quitText = this.add.text(120, 910, "Quit", {
      fontFamily: "WBB",
      fontSize: 120,
      color: "#492807",
    });

    titleContainer.add(quit);
    titleContainer.add(quitText);

    startContainer.setInteractive(
      new Phaser.Geom.Rectangle(startText.x - 170, startText.y - 20, 450, 130),
      Phaser.Geom.Rectangle.Contains
    );
    startContainer.on("pointerdown", () => {
      this.scene.start("Host");
    });
  }
}

export class Host extends Phaser.Scene {
  private background!: Phaser.GameObjects.Image;
  private post!: Phaser.GameObjects.Image;
  private host!: Phaser.GameObjects.Image;
  private code!: Phaser.GameObjects.Image;
  private backSign!: Phaser.GameObjects.Image;

  constructor() {
    super("Host");
  }

  preload() {
    this.load.image("background", "assets/background.png");
    this.load.image("post", "assets/post.png");
    this.load.image("host", "assets/host.png");
    this.load.image("code", "assets/code.png");
    this.load.image("back-sign", "assets/options.png");

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

    const postContainer = this.add.container(850, 620);
    const post = this.add.image(0, 0, "post");
    postContainer.add(post);

    const backContainer = this.add.container(350, -220);
    const backSign = this.add.image(0, 0, "back-sign");
    const backSignText = this.add.text(-250, 270, "Back", {
      fontFamily: "WBB",
      fontSize: 120,
      color: "#492807",
    });
    backContainer.add(backSign);
    backContainer.add(backSignText);

    const hostContainer = this.add.container(100, -240);
    const host = this.add.image(0, 0, "host");
    host.setDisplaySize(890, 290);
    const hostText = this.add.text(-180, -100, "Host", {
      fontFamily: "WBB",
      fontSize: 250,
      color: "#492807",
    });
    hostContainer.add(host);
    hostContainer.add(hostText);
    postContainer.add(hostContainer);

    const codeContainer = this.add.container(100, 80);
    const code = this.add.image(0, 0, "code");
    code.setDisplaySize(890, 290);
    code.setFlipX(true);
    const codeText = this.add.text(-150, -100, "Join", {
      fontFamily: "WBB",
      fontSize: 250,
      color: "#492807",
    });
    codeText.setRotation(-0.03);
    codeContainer.add(code);
    codeContainer.add(codeText);
    postContainer.add(codeContainer);

    backContainer.setInteractive(
      new Phaser.Geom.Rectangle(
        backSignText.x - 200,
        backSignText.y - 10,
        450,
        130
      ),
      Phaser.Geom.Rectangle.Contains
    );

    backContainer.on("pointerdown", () => {
      this.scene.start("MainScreen");
    });

    hostContainer.setInteractive(
      new Phaser.Geom.Rectangle(hostText.x - 240, hostText.y - 20, 840, 260),
      Phaser.Geom.Rectangle.Contains
    );

    hostContainer.on("pointerdown", () => {
      this.scene.start("Room");
    });

    codeContainer.setInteractive(
      new Phaser.Geom.Rectangle(codeText.x - 260, codeText.y - 30, 840, 260),
      Phaser.Geom.Rectangle.Contains
    );

    codeContainer.on("pointerdown", () => {
      this.scene.start("Code");
    });
  }
}

export class Code extends Phaser.Scene {
  private background!: Phaser.GameObjects.Image;
  private post!: Phaser.GameObjects.Image;
  private host!: Phaser.GameObjects.Image;
  private code!: Phaser.GameObjects.Image;
  private backSign!: Phaser.GameObjects.Image;

  constructor() {
    super("Code");
  }

  preload() {
    this.load.image("background", "assets/background.png");
    this.load.image("post", "assets/post.png");
    this.load.image("host", "assets/host.png");
    this.load.image("code", "assets/code.png");
    this.load.image("back-sign", "assets/options.png");
    this.load.image("start-code", "assets/code.png");

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

    const postContainer = this.add.container(850, 620);
    const post = this.add.image(0, 0, "post");
    postContainer.add(post);

    const backContainer = this.add.container(350, -220);
    const backSign = this.add.image(0, 0, "back-sign");
    const backSignText = this.add.text(-250, 270, "Back", {
      fontFamily: "WBB",
      fontSize: 120,
      color: "#492807",
    });
    backContainer.add(backSign);
    backContainer.add(backSignText);

    const hostContainer = this.add.container(100, -240);
    const host = this.add.image(0, 0, "host");
    host.setDisplaySize(890, 290);
    const hostText = this.add.text(-180, -100, "Code:", {
      fontFamily: "WBB",
      fontSize: 250,
      color: "#492807",
    });
    hostContainer.add(host);
    hostContainer.add(hostText);
    postContainer.add(hostContainer);

    const codeContainer = this.add.container(100, 80);
    const code = this.add.image(0, 0, "code");
    code.setDisplaySize(890, 290);
    code.setFlipX(true);
    const codeText = this.add.text(-360, -50, "_ _ _ _ _ _", {
      fontFamily: "WBB",
      fontSize: 150,
      color: "#492807",
    });
    codeText.setRotation(-0.03);
    codeContainer.add(code);
    codeContainer.add(codeText);
    postContainer.add(codeContainer);

    const startContainer = this.add.container(100, 80);
    const start = this.add.image(0, 250, "start-code");
    start.setDisplaySize(500, 200);
    const startText = this.add
      .text(-100, 180, "Join", {
        fontFamily: "WBB",
        fontSize: 150,
        color: "#492807",
      })
      .setRotation(0.03);
    startContainer.add(start);
    startContainer.add(startText);
    postContainer.add(startContainer);

    backContainer.setInteractive(
      new Phaser.Geom.Rectangle(
        backSignText.x - 200,
        backSignText.y - 10,
        450,
        130
      ),
      Phaser.Geom.Rectangle.Contains
    );

    backContainer.on("pointerdown", () => {
      this.scene.start("Host");
    });

    startContainer.setInteractive(
      new Phaser.Geom.Rectangle(startText.x - 150, startText.y - 20, 500, 180),
      Phaser.Geom.Rectangle.Contains
    );

    startContainer.on("pointerdown", () => {
      this.scene.start("Room");
    });
  }
}

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
    this.load.image("start-room", "assets/host.png");
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

    const postContainer = this.add.container(850, 620);
    postContainer.setPosition(400, 620);
    const post = this.add.image(0, 0, "post");
    postContainer.add(post);

    const backContainer = this.add.container(350, -220);
    const backSign = this.add.image(0, 0, "back-sign");
    const backSignText = this.add.text(-250, 270, "Back", {
      fontFamily: "WBB",
      fontSize: 120,
      color: "#492807",
    });
    backContainer.add(backSign);
    backContainer.add(backSignText);

    const hostContainer = this.add.container(100, -240);
    const host = this.add.image(0, 0, "host");
    host.setDisplaySize(890, 290);
    const hostText = this.add.text(-180, -100, "Code:", {
      fontFamily: "WBB",
      fontSize: 250,
      color: "#492807",
    });
    hostContainer.add(host);
    hostContainer.add(hostText);
    postContainer.add(hostContainer);

    const codeContainer = this.add.container(100, 80);
    const code = this.add.image(0, 0, "code");
    code.setDisplaySize(890, 290);
    code.setFlipX(true);
    const codeText = this.add.text(-360, -50, "_ _ _ _ _ _", {
      fontFamily: "WBB",
      fontSize: 150,
      color: "#492807",
    });
    codeText.setRotation(-0.03);
    codeContainer.add(code);
    codeContainer.add(codeText);
    postContainer.add(codeContainer);

    const startContainer = this.add.container(100, 80);
    const start = this.add.image(0, 250, "start-room");
    start.setDisplaySize(500, 200);
    const startText = this.add
      .text(-100, 180, "Join", {
        fontFamily: "WBB",
        fontSize: 150,
        color: "#492807",
      })
      .setRotation(0.03);
    startContainer.add(start);
    startContainer.add(startText);
    postContainer.add(startContainer);

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

    backContainer.setInteractive(
      new Phaser.Geom.Rectangle(
        backSignText.x - 200,
        backSignText.y - 10,
        450,
        130
      ),
      Phaser.Geom.Rectangle.Contains
    );

    backContainer.on("pointerdown", () => {
      this.scene.start("Host");
    });
  }
}
