import { Start } from "./scenes/Start";
import { CharacterSelection } from "./scenes/CharacterSelection";
import { MainScreen, Host, Code, Room } from "./scenes/MainScreen";
import { LoadingScreen } from "./scenes/LoadingScreen";
import { CutScene } from "./scenes/CutScene";
import { SettingsMenu } from "./scenes/Settings";
import { EmptyTest } from "./scenes/EmptyTest";
import { MapScene } from "./scenes/MapScene";

const config = {
  type: Phaser.AUTO,
  title: "Bandit Breakout",
  description: "Turn-based RGP",
  parent: "game-container",
  width: 1920,
  height: 1080,
  backgroundColor: "#000000",
  pixelArt: false,
  scene: [
    // EmptyTest,
    // Start,
    // CutScene,
    MainScreen,
    Host,
    Code,
    Room,
    LoadingScreen,
    CharacterSelection,
    SettingsMenu,
    MapScene,
  ],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

new Phaser.Game(config);
