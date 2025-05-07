import { Start } from "./scenes/Start";
import { CharacterSelection } from "./scenes/CharacterSelection";
import { MainScreen } from "./scenes/MainScreen";
import { MapScene } from "./scenes/MapScene";
import { EmptyTest } from "./scenes/EmptyTest"

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
    // Start,
    // CharacterSelection,
    MapScene,
    // EmptyTest,
    // MainScreen,
  ],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

new Phaser.Game(config);
