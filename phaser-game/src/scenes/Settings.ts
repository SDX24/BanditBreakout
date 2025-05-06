import Phaser from "phaser";
import { Settings } from "backend/areas/Types/Settings"
import WebFontLoader from "webfontloader";
import { get } from "http";
import { set } from "mongoose";

export class SettingsMenu extends Phaser.Scene {

  constructor() {
    super("Settings");
  }

  preload() {
    this.load.image("board", "tempAssets/settingsOverlay/board.png");
    this.load.svg("muteIcon", "tempAssets/settingsOverlay/Mute.svg");
    this.load.svg("slider", "tempAssets/settingsOverlay/Slider.svg");
    this.load.svg("slider_button", "tempAssets/settingsOverlay/Slider_button.svg");
    this.load.svg("soundIcon", "tempAssets/settingsOverlay/Sound.svg");
    this.load.svg("backboard", "tempAssets/settingsOverlay/backboard.svg")
    this.load.image("ovelayBackSign", "tempAssets/settingsOverlay/backSign.png");


    WebFontLoader.load({
      custom: {
        families: ['Wellfleet', 'WBB'],
        urls: ['/fonts.css']
      }
    });
}

  create(data: { previousSceneKey: Phaser.Scene }) {
    const containerScene = this.add.container(0, 0);
    const containerMain = this.add.container(960, 540);
    
    const backCover = this.add.graphics()
    .fillStyle(0x000000)
    .fillRect(0, 0, 1920, 1080)
    .setAlpha(0.4);
    containerScene.add(backCover);
    
    const board = this.add.image(0, 0, "board")
    containerMain.add(board);

    const backboardTexts = ["Close options", "Legend", "Settings"];
    //this should be something like checkInGame()
    const checkInGame = () => {
      backboardTexts.push("Leave game");
    }
    checkInGame();

    const getBackboardsOffset = (index: number) => {
      if (backboardTexts.length === 3) {
         let yOffset = -200 + index * 200
         return yOffset;
        } else {
          let yOffset = -220 + index * 150;
          return yOffset;
        }
  }

const backboards: any[] = []
backboardTexts.forEach((text, index) => {
    const yOffset = getBackboardsOffset(index);
    const backboard = this.add.image(0, yOffset, "backboard")
    backboard.setDisplaySize(backboard.width * 3, backboard.height * 2.2);

    const backboardText = this.add.text(0, yOffset, text, {
        fontFamily: "WBB",
        fontSize: 125,
        color: "#ffffff",
        align: "center",
    }).setOrigin(0.5);

    containerMain.add(backboard);
    containerMain.add(backboardText);

    backboard.setInteractive(new Phaser.Geom.Rectangle(0, 20, backboard.displayWidth, backboard.displayHeight), Phaser.Geom.Rectangle.Contains);
    backboard.on("pointerdown", () => {
        if (text === "Close options") {
            closeSettings();
        } else if (text === "Legend") {
            openLayout(text);
        } else if (text === "Settings") {
            openLayout(text);
        } else if (text === "Leave game") {
            closeSettings(); // this should work when game is there
        }
    });

    backboards.push(backboard, backboardText);
});
containerScene.add(containerMain);


const openLayout = (layoutName: string) => {
  containerMain.setVisible(false);

  const layoutContainer = this.add.container(960, 540);
  const layoutBoard = this.add.image(0, 0, "board");
  layoutContainer.add(layoutBoard);



  if (layoutName === "Legend") {

      layoutContainer.add([]);
  } else if (layoutName === "Settings") {

      const settingsLabel = this.add.text(0, -200, "Settings", {
          fontFamily: "Wellfleet",
          fontSize: 61,
          color: "#492807",
      }).setOrigin(0.5);

      const soundContainer = this.add.container(-400, 150);
      const volumeTexts = ["Music", "SFX", "Voice"];

      volumeTexts.forEach((text, index) => {
        const yOffset = getBackboardsOffset(index);
        const soundIcon = this.add.image(100, yOffset, "soundIcon")
        soundIcon.setDisplaySize(soundIcon.width * 0.6, soundIcon.height * 0.6);
        const volumeText = this.add.text(-200, yOffset-40, text, {
          fontFamily: "Wellfleet",
          fontSize: 61,
          color: "#ffffff",
          align: "center",
      })
      const volumeContainer = this.add.container(-400, 150);
      const volumeSlider = this.add.image(0, yOffset, "slider")
      const volumeSliderButton = this.add.image(0, yOffset, "slider_button")
      volumeContainer.add([volumeSlider, volumeSliderButton]);
      volumeContainer.setDisplaySize(volumeContainer.width * 0.6, volumeContainer.height * 0.6);

      soundContainer.add([soundIcon, volumeText, volumeContainer]);
      layoutContainer.add(soundContainer);

      soundIcon.setInteractive();
      soundIcon.on("pointerdown", () => {
        if (text === "Music") {
          console.log("Music");
        } else if (text === "SFX") {
          console.log("SFX");
        } else if (text === "Voice") {
          console.log("Voice");
        }
      });
      });
 
      layoutContainer.add([settingsLabel]);
  } else if (layoutName === "Rules") {

      layoutContainer.add([]);
  }



  const containerBackButton = this.add.container(-900, -350);
  const overlayBackSign = this.add.image(0, 0, "ovelayBackSign");
  overlayBackSign.setDisplaySize(overlayBackSign.width * 0.3, overlayBackSign.height * 0.32);
  containerBackButton.add(overlayBackSign);
  const backButtonText = this.add.text(0, -140, "Back", {
      fontFamily: "WBB",
      fontSize: 120,
      color: "#492807",
  });
  backButtonText.setRotation(-0.05);
  containerBackButton.add(backButtonText);

  containerBackButton.setSize(overlayBackSign.displayWidth, overlayBackSign.displayHeight);
  containerBackButton.setInteractive(new Phaser.Geom.Rectangle(0, 0, overlayBackSign.displayWidth, overlayBackSign.displayHeight-180), Phaser.Geom.Rectangle.Contains);

  layoutContainer.add([containerBackButton]);

  containerBackButton.setInteractive();
  containerBackButton.on("pointerdown", () => {
      layoutContainer.setVisible(false);
      containerMain.setVisible(true);
  });

  containerScene.add(layoutContainer);
};
    
  const closeSettings = () => {
    this.scene.stop();
    this.scene.resume(data.previousSceneKey);
};

    let lastScene = data.previousSceneKey
    this.input.keyboard!.on('keydown-ESC', (event: Event) => {
      event.preventDefault();
      closeSettings();
  });
  }


}