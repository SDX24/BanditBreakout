import useDb from "../middleware/useDb";
import skipTo from "../middleware/skipWithEscSpace";
export class Start extends Phaser.Scene {
  private logoGame!: Phaser.GameObjects.Image;
  private logoTeam!: Phaser.GameObjects.Image;

  constructor() {
    super("Start");
  }

  preload() {
    useDb(this);
    this.load.svg("logoTeam", encodeURIComponent("company__group__logo/CMD Z Logo.svg"));
    this.load.svg("logoGame", encodeURIComponent("game_logo/Bandit Logo Circle.svg"));
  }

  create() {

    const backgroundBlack = this.add.graphics().fillStyle(0x000000).fillRect(0, 0, 1920, 1080);
    const backgroundWhite = this.add.graphics().fillStyle(0xffffff).fillRect(0, 0, 1920, 1080);
    
    backgroundWhite.setAlpha(0);
    
    this.logoTeam = this.add.image(960, 540, "logoTeam");
    this.logoTeam.setDisplaySize(300, 300);
    this.logoTeam.setAlpha(0);
    
    this.logoGame = this.add.image(960, 540, "logoGame");
    this.logoGame.setDisplaySize(300, 300);
    this.logoGame.setAlpha(0);

    this.tweens.add({
      targets: backgroundWhite,
      alpha: 1,
      duration: 1000,
      delay: 2000,

    });

    this.tweens.add({
      targets: this.logoTeam,
      alpha: 1,
      duration: 1000,
      delay: 2000,
    });

    this.tweens.add({
        targets: this.logoTeam,
        alpha: 0,
        duration: 1000,
        delay: 3000,
      });
    
      this.tweens.add({
        targets: backgroundWhite,
        alpha: 0,
        duration: 1000,
        delay: 3000,
      });
    
    
    this.tweens.add({
      targets: this.logoGame,
      alpha: 1,
      duration: 1000,
      delay: 4000,
    });

    this.tweens.add({
        targets: this.logoGame,
        alpha: 0,
        duration: 1000,
        delay: 5000,
      });
    

    this.time.delayedCall(7000, () => {
        this.scene.start('CutScene');
      }
    );
  }
}