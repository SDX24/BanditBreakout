import Phaser from "phaser";
import WebFontLoader from "webfontloader";

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
    this.load.image("start", "assets/host.png");

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
  }
}
