import Phaser from "phaser";
import settingsListener from "../middleware/settingsListener";

export class EmptyTest extends Phaser.Scene {
  constructor() {
    super("EmptyTest");
  }

  create() {
    this.add
      .graphics()
      .fillGradientStyle(0x000000, 0xff0000, 0xffffff, 0x00ffff)
      .fillRect(0, 0, 1920, 1080);
    settingsListener(this);

    // In your game's main scene or wherever you start the BattleScene
    this.scene.start("BattleScene", {
      selectedCharacterId: 1, // Test with Buckshot (ID: 1)
      enemyCharacterId: 2, // Test with Serpy (ID: 2)
    });
  }
}
