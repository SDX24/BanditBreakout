import Phaser from "phaser";
import { Settings } from "backend/areas/Types/Settings"
import WebFontLoader from "webfontloader";
import { EventEmitter } from "stream";

export class SettingsMenu extends Phaser.Scene {

  constructor() {
    super("Settings");
  }

  preload() {
    this.load.image("board", "tempAssets/settings/board.png");
    // this.load.svg("mute", "tempAssets/settings/Mute.svg");
    // this.load.svg("settings", "tempAssets/settings/settings.svg");
    // this.load.svg("slider", "tempAssets/settings/Slider.svg");
    // this.load.svg("sound", "tempAssets/settings/Sound.svg");


    WebFontLoader.load({
      custom: {
        families: ['Wellfleet', 'WBB'],
        urls: ['/fonts.css']
      }
    });
}

  create(data: { previousSceneKey: Phaser.Scene }) {
    
    this.add.image(0, 0, "board").setOrigin(0, 0).setScale(1.5);
    let lastScene = data.previousSceneKey
    this.input.keyboard!.on('keydown-ESC', (event: Event) => {
      event.preventDefault();
      this.scene.stop();
      this.scene.resume(lastScene);
  });
  }


}