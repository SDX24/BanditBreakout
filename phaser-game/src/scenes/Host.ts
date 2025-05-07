import Phaser from "phaser";
import WebFontLoader from "webfontloader";

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
    const hostText = this.add.text(770, 300, "Host", {
      fontFamily: "WBB",
      fontSize: 250,
      color: "#492807",
    });
    postContainer.add(host);
    postContainer.add(hostText);

    const code = this.add.image(960, 700, "code");
    code.setDisplaySize(890, 290);
    code.setFlipX(true);
    const codeText = this.add.text(790, 600, "Join", {
      fontFamily: "WBB",
      fontSize: 250,
      color: "#492807",
    });
    postContainer.add(code);
    postContainer.add(codeText);
  }
}
