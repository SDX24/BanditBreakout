import Phaser from "phaser";
import Settings from "backend/areas/Types/Settings"
import WebFontLoader from "webfontloader";


export class SettingsMenu extends Phaser.Scene {
  private settings: Settings;

  constructor() {
    super("Settings");
    this.settings = new Settings();
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

      const soundContainer = this.add.container(-450, 150);
      const volumeTexts = ["Music", "SFX", "Voice"];
      const settings = this.settings

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

      const volumeContainer = this.add.container(520, yOffset)

      const volumeSlider = this.add.image(0, 0, "slider")
      volumeSlider.setDisplaySize(volumeSlider.width * 1.7, volumeSlider.height * 1.7);

      const volumeSliderButton = this.add.image(0, 0, "slider_button")
      volumeSliderButton.setDisplaySize(volumeSliderButton.width * 0.6, volumeSliderButton.height * 0.6);
      volumeSliderButton.setInteractive({ draggable: true });
      

      //set on start from localstorage
      const minX = -volumeSlider.displayWidth / 2 + 70;
      const maxX = volumeSlider.displayWidth / 2 - 50;

      let initialVolume = 0;
      if (text === "Music") {
        initialVolume = settings.musicVolume;
      } else if (text === "SFX") {
        initialVolume = settings.sfxVolume;
      } else if (text === "Voice") {
        initialVolume = settings.voicesVolume;
      }

      // get init position
      volumeSliderButton.x = Phaser.Math.Interpolation.Linear([minX, maxX], initialVolume);

      if (initialVolume === 0) {
        soundIcon.setTexture("muteIcon");
      } else {
        soundIcon.setTexture("soundIcon");
      }


      this.input.setDraggable(volumeSliderButton);

      this.input.on("drag", (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Image, dragX: number) => {
       if (gameObject === volumeSliderButton) {
          gameObject.x = Phaser.Math.Clamp(dragX, minX, maxX);

          let volume = Phaser.Math.Clamp((gameObject.x - minX) / (maxX - minX), 0, 1);
          volume = Math.round(volume * 10000) / 10000;

          if (volume === 0) {
            soundIcon.setTexture("muteIcon");
          } else {
            soundIcon.setTexture("soundIcon");
          }

          if (text === "Music") {
            settings.setMusicVolume(volume);
          } else if (text === "SFX") {
            settings.setSfxVolume(volume);
          } else if (text === "Voice") {
            settings.setVoicesVolume(volume);
          }

          console.log(`${text} Volume:`, volume);
        }
      });



      volumeContainer.add([volumeSlider, volumeSliderButton]);
      soundContainer.add([soundIcon, volumeText, volumeContainer]);
      
    
    });
    
      layoutContainer.add([settingsLabel, soundContainer]);




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