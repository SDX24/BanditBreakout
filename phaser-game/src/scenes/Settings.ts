import Phaser from "phaser";
import Settings from "../../../backend/areas/Types/Settings"
import WebFontLoader from "webfontloader";


export class SettingsMenu extends Phaser.Scene {
  private settings: Settings;
  private rulebookTexts: { index: number; label: string; description: string }[];

  constructor() {
    super("Settings");
    this.settings = new Settings();
    this.rulebookTexts = [
      { index: 0, label: "Moving on the board", description: "Roll a dice. Whatever value you get will determine the amount of tiles you get to advance." },
      { index: 1, label: "Gold", description: 
        `1. Each safe spot will grant you 3 gold, collect gold to
    gain benefits later down the line

2. Each Time you enter into a new city/area, players
    can enter the shop`
      },
      { index: 2, label: "HP & Combat", description: 
        `1. Each side starts with 10 HP

2. Each turn, the player and the opponent both roll a
    dice to determine amount of bullets they are able to
    shoot, each bullet deals 1 HP of damage

3. Whoever gets the opposing side to drop below 0 HP
    wins

4. Winning a battle will give you 3 gold

5. If you lose all your HP, you will be sent back 2 tiles
    and take away 3 gold. ` },
      { index: 3, label: "Safe Tile", description: "This tile is a safe space. Gain +3 gold!" },
      { index: 4, label: "Decision Tile", description: "This tile unlocks cool dialogue and determines your path moving forward." },
      { index: 5, label: "Mining Tile", description: "This tile grants player a random amount of gold between 10–30." },
      { index: 6, label: "Event Tile", description: "This tile unlocks cool events that may grant rewards and lore." },
      { index: 7, label: "Treasure Tile", description: "This tile gives player a random one-time use item." },
      { index: 8, label: "Effect Tile", description: "This tile grants player a random one-time combat buff." },
      { index: 9, label: "Slots Tile", description: "This tile grants player a random amount of gold between 20–50." },
      { index: 10, label: "Battle Tile", description: "You are ambushed by an enemy. Fight for your survival!" },
    ];
  }

  preload() {
    this.load.image("board", "tempAssets/settingsOverlay/board.png");
    this.load.svg("muteIcon", "tempAssets/settingsOverlay/Mute.svg");
    this.load.svg("slider", "tempAssets/settingsOverlay/Slider.svg");
    this.load.svg("slider_button", "tempAssets/settingsOverlay/Slider_button.svg");
    this.load.svg("soundIcon", "tempAssets/settingsOverlay/Sound.svg");
    this.load.svg("backboard", "tempAssets/settingsOverlay/backboard.svg")
    this.load.image("ovelayBackSign", "tempAssets/settingsOverlay/backSign.png");
    this.load.image("page", "tempAssets/settingsOverlay/page.png");
    this.load.image("pagePinned", "tempAssets/settingsOverlay/pagePinned.png");
    this.load.svg("arrow", "tempAssets/settingsOverlay/arrow.svg");

    this.load.svg("safe", "tempAssets/tiles/safe.svg");
    this.load.svg("decision", "tempAssets/tiles/decision.svg");
    this.load.svg("mining", "tempAssets/tiles/mining.svg");
    this.load.svg("event", "tempAssets/tiles/event.svg");
    this.load.svg("treasure", "tempAssets/tiles/treasure.svg");
    this.load.svg("effect", "tempAssets/tiles/effect.svg");
    this.load.svg("slots", "tempAssets/tiles/slots.svg");
    this.load.svg("battle", "tempAssets/tiles/battle.svg");




    WebFontLoader.load({
      custom: {
        families: ['Wellfleet', 'WBB'],
        urls: ['/fonts.css']
      }
    });
}

  create(data: { previousSceneKey: Phaser.Scene, isInGame?: boolean}) {
    const containerScene = this.add.container(0, 0);
    const containerMain = this.add.container(960, 540);
    
    const backCover = this.add.graphics()
    .fillStyle(0x000000)
    .fillRect(0, 0, 1920, 1080)
    .setAlpha(0.4);
    containerScene.add(backCover);
    
    const board = this.add.image(0, 0, "board")
    containerMain.add(board);
    

    const backboardTexts = ["Close options", "Rulebook", "Settings"];
    //this should be something like checkInGame()
    const checkInGame = () => {
      
      backboardTexts.push("Leave game");
    }

    if (data.isInGame) {
      checkInGame();
    }

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

    backboardText.setInteractive()
    backboardText.on("pointerdown", () => {
        if (text === "Close options") {
            closeSettings();
        } else if (text === "Rulebook") {
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




  if (layoutName === "Rulebook") {

    const rulesLabelContainer = this.add.container(0, 0);
  
    // left Page
    const leftPage = this.add.image(-550, 0, "page");
    leftPage.setOrigin(0.5);
    leftPage.setDisplaySize(leftPage.width * 0.9, leftPage.height * 0.9);
    let leftLabel = this.add.text(-550, 0, "Rules", {
      fontFamily: "WBB",
      fontSize: 125,
      color: "#000000",
      align: "center",
    }).setOrigin(0.5);
  
    // middle Page
    const middlePage = this.add.image(0, 0, "pagePinned");
    middlePage.setOrigin(0.5);
    middlePage.setDisplaySize(leftPage.displayWidth, leftPage.displayHeight);
    let middleLabel1 = this.add.text(0, -150, this.rulebookTexts[0].label, {
      fontFamily: "Wellfleet",
      fontSize: 31,
      color: "#462406",
      align: "center",
    }).setOrigin(0.5);
    let middleDescription1 = this.add.text(0, -100, this.rulebookTexts[0].description, {
      fontFamily: "Wellfleet",
      fontSize: 16,
      color: "#462406",
      align: "center",
      wordWrap: { width: middlePage.displayWidth * 0.8 },
    }).setOrigin(0.5);

    let middleLabel2 = this.add.text(0, 0, this.rulebookTexts[1].label, {
      fontFamily: "Wellfleet",
      fontSize: 31,
      color: "#462406",
      align: "center",
    }).setOrigin(0.5);
    let middleDescription2 = this.add.text(0, 75, this.rulebookTexts[1].description, {
      fontFamily: "Wellfleet",
      fontSize: 16,
      color: "#462406",
      wordWrap: { width: middlePage.displayWidth * 0.8 },
    }).setOrigin(0.5);
  
    // Right Page
    const rightPage = this.add.image(550, 0, "pagePinned");
    rightPage.setOrigin(0.5);
    rightPage.setDisplaySize(leftPage.displayWidth, leftPage.displayHeight);
    let rightLabel = this.add.text(550, -150, this.rulebookTexts[2].label, {
      fontFamily: "Wellfleet",
      fontSize: 31,
      color: "#462406",
      align: "center",
    }).setOrigin(0.5);
    let rightDescription = this.add.text(550, 0, this.rulebookTexts[2].description, {
      fontFamily: "Wellfleet",
      fontSize: 16,
      color: "#462406",
      wordWrap: { width: rightPage.displayWidth * 0.8 },
    }).setOrigin(0.5);
  
    rulesLabelContainer.add([
      leftPage,
      leftLabel,
      middlePage,
      middleLabel1,
      middleLabel2,
      middleDescription1,
      middleDescription2,
      rightPage,
      rightLabel,
      rightDescription,
    ]);
  
    layoutContainer.add(rulesLabelContainer);
  
    // left arrow (hidden on rules)
    const leftArrow = this.add.image(-900, 0, "arrow")
    .setOrigin(0.5)
    .setDisplaySize(100, 100)
    .setInteractive()
    leftArrow.setVisible(false); // hide on rules
  
    // right arrow (hidden on tiles)
    const rightArrow = this.add.image(900, 0, "arrow")
    .setOrigin(0.5)
    .setDisplaySize(100, 100)
    .setFlipX(true)
    .setInteractive()

    const tilesGuideTexts: Phaser.GameObjects.Text[] = [];
    const tilesGuideImages: Phaser.GameObjects.Image[] = [];
    const tileImageKeys: { [key: string]: string } = {
      "Safe Tile": "safe",
      "Decision Tile": "decision",
      "Mining Tile": "mining",
      "Event Tile": "event",
      "Treasure Tile": "treasure",
      "Effect Tile": "effect",
      "Slots Tile": "slots",
      "Battle Tile": "battle",
    };
    
    let yOffsetStart = -175;
    let yOffset = yOffsetStart;
    const createTilesGuideTexts = (i: number, yOffsetStart: number, xOffset: number) => {
      const label = this.add.text(xOffset -50, yOffset, this.rulebookTexts[i].label, {
        fontFamily: "Wellfleet",
        fontSize: 25,
        color: "#462406",
        align: "left",
        wordWrap: { width: middlePage.displayWidth * 0.5 }
      }).setOrigin(0.5).setVisible(false);
    
      const description = this.add.text(xOffset, yOffset + 50, this.rulebookTexts[i].description, {
        fontFamily: "Wellfleet",
        fontSize: 16,
        color: "#462406",
        wordWrap: { width: middlePage.displayWidth * 0.5 },
      }).setOrigin(0.5).setVisible(false);


      const imageKey = tileImageKeys[this.rulebookTexts[i].label];
        const tileImage = this.add.image(xOffset -180, yOffset +20, imageKey)
        layoutContainer.add(tileImage);
        
        tileImage.setOrigin(0.5).setDisplaySize(tileImage.width * 0.5, tileImage.height * 0.5)
        .setVisible(false)

        if (tileImageKeys[this.rulebookTexts[i].label] === "slots") {
          tileImage.setDisplaySize(tileImage.width * 0.35, tileImage.height * 0.35)
        }

        rulesLabelContainer.add([label, description]);
        tilesGuideImages.push(tileImage);
        tilesGuideTexts.push(label, description);
    
      yOffset += 100;
    }

    for (let i = 3; i < 7; i++) {
      createTilesGuideTexts(i, yOffset, 20);
    }

    yOffset = yOffsetStart;
    for (let i = 7; i < 11; i++) {
      createTilesGuideTexts(i, yOffset, 600);
    }
    
    rightArrow.on("pointerdown", () => {
      leftLabel.setText("Tiles Guide");
    
      [middleLabel1, middleDescription1, middleLabel2, middleDescription2, rightLabel, rightDescription].forEach((text) => {
        text.setVisible(false);
      });
    
      tilesGuideTexts.forEach((text) => {
        text.setVisible(true);
      });

      tilesGuideImages.forEach((image) => {
        image.setVisible(true);
      });
    
      rightArrow.setVisible(false);
      leftArrow.setVisible(true);
    });
    
    leftArrow.on("pointerdown", () => {
      leftLabel.setText("Rules");
    
      tilesGuideTexts.forEach((text) => {
        text.setVisible(false);
      });

      tilesGuideImages.forEach((image) => {
        image.setVisible(false);
      });
    
      [middleLabel1, middleDescription1, middleLabel2, middleDescription2, rightLabel, rightDescription].forEach((text) => {
        text.setVisible(true);
      });
    
      leftArrow.setVisible(false);
      rightArrow.setVisible(true);
    });
  
    layoutContainer.add([leftArrow, rightArrow]);



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

      // remove the tiles Guide if user quit using back button
      
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