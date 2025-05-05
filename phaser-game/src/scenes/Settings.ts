import Phaser from "phaser";
import { Settings } from "backend/areas/Types/Settings"
import WebFontLoader from "webfontloader";

export class SettingsMenu extends Phaser.Scene {

  constructor() {
    super("Settings");
  }

  preload() {

    WebFontLoader.load({
      custom: {
        families: ['Wellfleet', 'WBB'],
        urls: ['/fonts.css']
      }
    });
}

  create() {
  
    
  }


}