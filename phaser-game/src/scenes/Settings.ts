import Phaser from "phaser";
import { Settings } from "backend/areas/Types/Settings"
import WebFontLoader from "webfontloader";
import { get } from "http";

export class SettingsMenu extends Phaser.Scene {

  constructor() {
    super("Settings");
  }

  preload() {
    this.load.image("board", "tempAssets/settingsOverlay/board.png");
    this.load.svg("muteIcon", "tempAssets/settingsOverlay/Mute.svg");
    // this.load.svg("sliderIcon", "tempAssets/settings/Slider.svg");
    this.load.svg("soundIcon", "tempAssets/settingsOverlay/Sound.svg");
    this.load.svg("backboard", "tempAssets/settingsOverlay/backboard.svg")


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

  const closeSettings = () => {
    this.scene.stop();
    this.scene.resume(data.previousSceneKey);
};


const openLayout = (layoutName: string) => {
  containerMain.removeAll();

  if (layoutName === "Legend") {
      const legendBackboard = this.add.image(0, -100, "backboard").setDisplaySize(300, 100);
      const guideBackboard = this.add.image(0, 100, "backboard").setDisplaySize(300, 100);
      const legendText = this.add.text(0, -100, "Legend", { fontFamily: "WBB", fontSize: 64, color: "#ffffff" }).setOrigin(0.5);
      const guideText = this.add.text(0, 100, "Guide", { fontFamily: "WBB", fontSize: 64, color: "#ffffff" }).setOrigin(0.5);

      containerMain.add([legendBackboard, guideBackboard, legendText, guideText]);
  } else if (layoutName === "Settings") {
      const settingsBackboard = this.add.image(0, 0, "backboard").setDisplaySize(300, 100);
      const settingsText = this.add.text(0, 0, "Settings", { fontFamily: "WBB", fontSize: 64, color: "#ffffff" }).setOrigin(0.5);

      containerMain.add([settingsBackboard, settingsText]);
  }
};

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

  backboard.setInteractive();
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
});



    // const soundIcon = this.add.image(0, 0, "soundIcon")
    // const muteIcon = this.add.image(0, 0, "muteIcon")
    // containerMain.add(muteIcon);
    // containerMain.add(soundIcon);
    
    containerScene.add(containerMain);

    let lastScene = data.previousSceneKey
    this.input.keyboard!.on('keydown-ESC', (event: Event) => {
      event.preventDefault();
      closeSettings();
  });
  }


}