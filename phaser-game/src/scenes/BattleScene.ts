import Phaser from "phaser";
import { Characters } from "../../../backend/areas/Types/Character";
import WebFontLoader from "webfontloader";
import { SocketService } from "../services/SocketService";
import { MapScene } from "./MapScene";

export class BattleScene extends Phaser.Scene {
  private socket = SocketService.getInstance();
  private gameId: string = "";
  private playerId: number = 0;
  private playerName: string = "Scout";
  private enemyName: string = "Wim";
  private selectedCharacterId = 1;
  private enemyCharacterId = 2;

  private fontsReady = false;

  private currentTurn: "player" | "enemy" = "player";
  private playerHP: number = 10;
  private enemyHP: number = 10;
  private diceVideos: Map<string, Phaser.GameObjects.Video> = new Map();
  private playerHealthBar!: Phaser.GameObjects.Image;
  private enemyHealthBar!: Phaser.GameObjects.Image;
  private playerHealthText!: Phaser.GameObjects.Text;
  private enemyHealthText!: Phaser.GameObjects.Text;

  private healthBackOneContainer!: Phaser.GameObjects.Container;
  private healthBackTwoContainer!: Phaser.GameObjects.Container;

  private battleStarted: boolean = false;

  private rollButton?: Phaser.GameObjects.Text;
  private diceResult?: Phaser.GameObjects.Text;
  private isRolling: boolean = false;
  private battleData: any;
  private turns: any[] = [];
  private turnIndex: number = 0;

  // Add character settings for battle scene
  private characterSettings: {
    [key: string]: { scale: number; offsetY: number };
  } = {
    buckshot: { scale: 0.7, offsetY: 0 },
    serpy: { scale: 0.75, offsetY: -30 },
    grit: { scale: 0.75, offsetY: -20 },
    solstice: { scale: 0.65, offsetY: -50 },
    scout: { scale: 0.7, offsetY: -30 },
  };

  constructor() {
    super("BattleScene");
  }

  init(data: { player1: number; character1: number; player2: number; character2: number, result: string; player1HP: number; player2HP: number; winner: number | null; turn: number }) {
    this.battleData = {
      player1: data.player1,
      character1: data.character1,
      player2: data.player2,
      character2: data.character2,
      result: data.result,
      player1HP: data.player1HP,
      player2HP: data.player2HP,
      winner: data.winner,
      turn: data.turn,
    };
    // this.gameId = data.gameId;
    // this.playerId = data.playerId;

    // // Store the character IDs
    // if (data.selectedCharacterId) {
    //   this.selectedCharacterId = data.selectedCharacterId;
    // }
    // if (data.enemyCharacterId) {
    //   this.enemyCharacterId = data.enemyCharacterId;
    // }

    // // For player
    // const playerCharId = data.selectedCharacterId;
    // if (typeof playerCharId === "number") {
    //   const playerChar = Characters.find((c) => c.id === playerCharId);
    //   if (playerChar) this.playerName = playerChar.name;
    // }
    // // For enemy
    // const enemyCharId = data.enemyCharacterId;
    // if (typeof enemyCharId === "number") {
    //   const enemyChar = Characters.find((c) => c.id === enemyCharId);
    //   if (enemyChar) this.enemyName = enemyChar.name;
    // }
  }

  preload() {
    const serverUrl =
      import.meta.env.VITE_SERVER_URL || "http://localhost:3000";
    this.load.setBaseURL(serverUrl);
    this.load.setPath("assets");

    // - battle_screen/shield.png
    // - battle_screen/victory.svg
    // - battle_screen/background.png
    // - battle_screen/defeat.svg
    // - battle_screen/health backing.svg
    // - battle_screen/health bar.svg
    //- player_overlay/banner.svg

    this.load.image("battle-background", "battle_scene/battle-bg.png");
    this.load.svg("health-bar 1", "battle_scene/health bar.svg");
    this.load.svg("health-bar 2", "battle_scene/health bar.svg");
    this.load.image("health-back-bar 1", "battle_scene/backing-green.png");
    this.load.image("health-back-bar 2", "battle_scene/backing-green.png");
    this.load.svg("banner 1", "battle_scene/banner.svg");
    this.load.svg("banner 2", "battle_scene/banner.svg");
    // this.load.svg("buckshot-back", "battle_scene/buckshot-back.svg");
    // this.load.svg("wim-front", "battle_scene/wim-front.svg");
    this.load.svg("attack-button", "battle_scene/health backing.svg");
    this.load.svg("defend-button", "battle_scene/health backing.svg");

    Characters.forEach((char) => {
      // Load front view
      this.load.svg(
        char.name.toLowerCase(),
        encodeURIComponent(
          `character_asset/${char.name.toLowerCase()}Front.svg`
        )
      );
    });

    this.load.svg(
      "buckshot-back",
      encodeURIComponent("characterSVGs/Buckshot/005-cropped (1).svg")
    );

    this.load.svg(
      "grit-back",
      encodeURIComponent("characterSVGs/Grit/006-cropped (1).svg")
    );

    this.load.svg(
      "serpy-back",
      encodeURIComponent("characterSVGs/Serpy/006-cropped (4).svg")
    );

    this.load.svg(
      "solstice-back",
      encodeURIComponent("characterSVGs/Solstice/006-cropped (5).svg")
    );

    this.load.svg(
      "scout-back",
      encodeURIComponent("characterSVGs/Scout/006-cropped (3).svg")
    );

    WebFontLoader.load({
      custom: {
        families: ["Wellfleet", "WBB"],
        urls: ["/fonts.css"],
      },
      active: () => {
        this.fontsReady = true;
      },
    });

    // Add dice video preloading
    for (let i = 1; i <= 6; i++) {
      this.load.video(`dice${i}`, `assets/dice/dice${i}.mp4`);
    }
  }

  create() {
    if (!this.fontsReady) {
      this.time.delayedCall(50, () => this.create(), [], this);
      return;
    }


    // For player
    this.selectedCharacterId = this.battleData.character1;
    this.playerName = Characters.find((c) => c.id === this.battleData.character1)!.name || "";
    // For enemy
    this.enemyCharacterId = this.battleData.character2;
    this.enemyName = Characters.find((c) => c.id === this.battleData.character2)!.name || "";


    const screen = this.add.container(0, 0);
    const background = this.add.image(960, 540, "battle-background");
    background.setDisplaySize(1920, 1080);
    screen.add(background);

    // Player part
    const healthBackOneContainer = this.add.container(400, 150);
    const healthBackBarOne = this.add.image(0, 0, "health-back-bar 1");
    healthBackBarOne.setDisplaySize(600, 100);
    healthBackOneContainer.add(healthBackBarOne);

    const healthBarOneContainer = this.add.container(400, 150);
    const healthBarOne = this.add.image(0, 0, "health-bar 1");
    healthBarOne.setDisplaySize(700, 400);
    healthBarOne.setOrigin(0, 0.5); // Set origin to left side
    healthBarOne.setX(-350); // Adjust X position to align with backing
    healthBarOneContainer.add(healthBarOne);

    const healthTextOne = this.add.text(-80, -10, "10/10", {
      fontFamily: "WBB",
      fontSize: 45,
      color: "#ffffff",
      align: "center",
    });
    healthBarOneContainer.add(healthTextOne);

    const hpTextOne = this.add.text(220, -10, "HP", {
      fontFamily: "WBB",
      fontSize: 45,
      color: "#000000",
      align: "center",
    });
    healthBarOneContainer.add(hpTextOne);

    const bannerOneContainer = this.add.container(400, 5);
    const bannerOne = this.add.image(0, 0, "banner 1");
    bannerOne.setDisplaySize(600, 350);
    bannerOneContainer.add(bannerOne);
    const bannerOneText = this.add.text(-165, 70, this.enemyName, {
      fontFamily: "WBB",
      fontSize: 45,
      color: "#462406",
      align: "center",
    });
    bannerOneText.setOrigin(0.5);
    bannerOneContainer.add(bannerOneText);

    // Enemy part
    const healthBackTwoContainer = this.add.container(1500, 900);
    const healthBackBarTwo = this.add.image(0, 0, "health-back-bar 2");
    healthBackBarTwo.setDisplaySize(600, 100);
    healthBackTwoContainer.add(healthBackBarTwo);

    const healthBarTwoContainer = this.add.container(1500, 900);
    const healthBarTwo = this.add.image(0, 0, "health-bar 2");
    healthBarTwo.setDisplaySize(700, 400);
    healthBarTwo.setOrigin(0, 0.5); // Set origin to left side
    healthBarTwo.setX(-350); // Adjust X position to align with backing
    healthBarTwoContainer.add(healthBarTwo);

    const healthTextTwo = this.add.text(-80, -10, "10/10", {
      fontFamily: "WBB",
      fontSize: 45,
      color: "#ffffff",
      align: "center",
    });
    healthBarTwoContainer.add(healthTextTwo);

    const hpTextTwo = this.add.text(220, -10, "HP", {
      fontFamily: "WBB",
      fontSize: 45,
      color: "#000000",
      align: "center",
    });
    healthBarTwoContainer.add(hpTextTwo);

    const bannerTwoContainer = this.add.container(1500, 755);
    const bannerTwo = this.add.image(0, 0, "banner 2");
    bannerTwo.setDisplaySize(600, 350);
    bannerTwoContainer.add(bannerTwo);
    const bannerTextTwo = this.add.text(-165, 70, this.playerName, {
      fontFamily: "WBB",
      fontSize: 45,
      color: "#462406",
      align: "center",
    });
    bannerTextTwo.setOrigin(0.5);
    bannerTwoContainer.add(bannerTextTwo);

    // For player character
    const playerContainer = this.add.container(800, 700);

    // Add shadow for player character (relative to container position)
    const playerShadow = this.add.ellipse(-90, 300, 450, 150, 0x000000, 0.4);
    playerContainer.add(playerShadow);

    // Debug logs
    const backKey = `${this.playerName.toLowerCase()}-back`;
    console.log("Loading back image with key:", backKey);
    console.log("Available texture keys:", this.textures.list);

    // Display player character (back view) with similar scaling

    // For player character (back view)
    let backTexture = "";
    switch (this.selectedCharacterId) {
      case 1: backTexture = "buckshot-back"; break;
      case 2: backTexture = "serpy-back"; break;
      case 3: backTexture = "grit-back"; break;
      case 4: backTexture = "solstice-back"; break;
      case 5: backTexture = "scout-back"; break;
      default: backTexture = "scout-back";
    }
    const playerChar = this.add.image(-40, 70, backTexture);
    const playerSettings = this.characterSettings[this.playerName.toLowerCase()] || { scale: 0.7, offsetY: 0 };
    const baseSize = 600;
    const playerScaledSize = baseSize * playerSettings.scale * 1.2;
    playerChar.setDisplaySize(playerScaledSize * 0.8, playerScaledSize);
    playerChar.setY(playerChar.y + playerSettings.offsetY);
    playerContainer.add(playerChar);

    // For enemy character (front view)
    let enemyTexture = "";
    const enemyCharObj = Characters.find(c => c.id === this.enemyCharacterId);
    if (enemyCharObj) {
      enemyTexture = enemyCharObj.name.toLowerCase();
    } else {
      enemyTexture = "wim"; // fallback
    }
       // For enemy character
    const enemyContainer = this.add.container(1430, 300);
    const enemyShadow = this.add.ellipse(0, 200, 400, 130, 0x000000, 0.4);
    enemyContainer.add(enemyShadow);
    
    const enemyChar = this.add.image(-20, 70, enemyTexture);
    const settings = this.characterSettings[this.enemyName.toLowerCase()] || { scale: 0.7, offsetY: 0 };
    const scaledSize = baseSize * settings.scale;
    enemyChar.setDisplaySize(scaledSize * 0.8, scaledSize);
    enemyChar.setY(enemyChar.y + settings.offsetY);
    enemyContainer.add(enemyChar);



    // Store references to health bars and texts
    // Always assign player1 to left (enemy) and player2 to right (player) for consistency
    this.playerHealthBar = healthBackBarOne;
    this.playerHealthText = healthTextOne;
    this.enemyHealthBar = healthBackBarTwo;
    this.enemyHealthText = healthTextTwo;
    // Store container references
    this.healthBackOneContainer = healthBackOneContainer;
    this.healthBackTwoContainer = healthBackTwoContainer;

    // Initialize dice videos
    for (let i = 1; i <= 6; i++) {
      const video = this.add.video(960, 540, `dice${i}`);
      video.setVisible(false);
      this.diceVideos.set(`dice${i}`, video);
    }

    // Remove manual dice button and logic
    if (this.rollButton) this.rollButton.destroy();
    this.rollButton = undefined;
    if (this.diceResult) this.diceResult.destroy();
    this.diceResult = undefined;

    // Parse turns from result string
    this.turns = this.parseBattleResult(this.battleData.result);
    this.turnIndex = 0;
    // Set initial HPs
    this.playerHP = 10;
    this.enemyHP = 10;
    // Show turn text
    // this.turnText = this.add.text(this.scale.width / 2, 100, "", {
    //   fontFamily: "WBB",
    //   fontSize: 36,
    //   color: "#fff",
    //   align: "center",
    //   wordWrap: { width: 1200 },
    // }).setOrigin(0.5);
    // Start the replay
    this.playBattleReplay();

    
  }

  // Helper to parse the battle result string into an array of turn objects
  private parseBattleResult(result: string) {
    // Example line: Turn 1: Player 2 rolled 1, dealing 1 damage. Player 1 rolled 4, dealing 4 damage. Player 2 HP: 6, Player 1 HP: 9,
    const turnLines = result.split(/\n|\r/).filter((l) => l.trim().startsWith("Turn"));
    const turns = turnLines.map((line) => {
      const turnMatch = line.match(/Turn (\d+): Player (\d+) rolled (\d+), dealing (\d+) damage. Player (\d+) rolled (\d+), dealing (\d+) damage. Player (\d+) HP: (-?\d+), Player (\d+) HP: (-?\d+)[.,]/);
      if (turnMatch) {
        return {
          turn: parseInt(turnMatch[1]),
          p1: parseInt(turnMatch[2]),
          p1Roll: parseInt(turnMatch[3]),
          p1Dmg: parseInt(turnMatch[4]),
          p2: parseInt(turnMatch[5]),
          p2Roll: parseInt(turnMatch[6]),
          p2Dmg: parseInt(turnMatch[7]),
          p1HP: parseInt(turnMatch[9]),
          p2HP: parseInt(turnMatch[11]),
          raw: line,
        };
      }
      return { raw: line };
    });
    return turns;
  }

  // Animate each turn with delays
  private playBattleReplay() {
    if (this.turnIndex >= this.turns.length) {
      // Show winner/final result
      this.showBattleResult();
      return;
    }
    const turn = this.turns[this.turnIndex];
    if (!turn.p1Roll || !turn.p2Roll) {
      // Skip malformed turn
      this.turnIndex++;
      this.time.delayedCall(500, () => this.playBattleReplay());
      return;
    }
    // Determine which player is which
    const p1Id = this.battleData.player1;
    const p2Id = this.battleData.player2;
    // Animate dice rolls and HP changes
    this.animateTurn(turn, () => {
      this.turnIndex++;
      this.time.delayedCall(1200, () => this.playBattleReplay());
    });
  }

  private animateTurn(turn: any, onComplete: () => void) {
    // Animate dice rolls for both players
    const showDice = (roll: number, x: number, y: number, cb: () => void) => {
      const key = `dice${roll}`;
      const video = this.diceVideos.get(key);
      if (video) {
        video.setScale(0.5);
        video.setPosition(x, y);
        video.setVisible(true);
        const maskShape = this.make.graphics({ x: x, y: y});
        maskShape.fillStyle(0xffffff);
        maskShape.fillRoundedRect(-97.5, -122.5, 195, 185, 72);
        const mask = maskShape.createGeometryMask();
        video.setMask(mask);
        video.play();
        video.once("complete", () => {
          video.setVisible(false);
          cb();
        });
      } else {
        cb();
      }
    };
    // Always show player1's roll (left), then player2's roll (right), then update HPs
    showDice(turn.p1Roll, 600, 400, () => {
      showDice(turn.p2Roll, 1300, 400, () => {
        // Update HP bars
        this.enemyHP = turn.p1HP;
        this.playerHP = turn.p2HP;
        // If HP is negative, set to 0
        if (this.playerHP < 0) this.playerHP = 0;
        if (this.enemyHP < 0) this.enemyHP = 0;
        this.updateHealthBar(this.playerHealthBar, this.playerHealthText, this.playerHP);
        this.updateHealthBar(this.enemyHealthBar, this.enemyHealthText, this.enemyHP);
        onComplete();
      });
    });
  }

  private showBattleResult() {
    // Determine winner's character name or draw
    let winnerCharName = "";
    let isDraw = false;
    if (this.battleData.winner === this.battleData.player1) {
      winnerCharName = Characters.find(c => c.id === this.battleData.character1)?.name || "";
    } else if (this.battleData.winner === this.battleData.player2) {
      winnerCharName = Characters.find(c => c.id === this.battleData.character2)?.name || "";
    } else {
      isDraw = true;
    }
    // Show winner or draw text with bigger font
    this.add
      .text(this.scale.width / 2, this.scale.height / 2, isDraw ? "Draw!" : `${winnerCharName} wins!`, {
        fontSize: "120px",
        color: "#fff",
        fontFamily: "WBB",
        align: "center",
        wordWrap: { width: 1200 },
      })
      .setOrigin(0.5);
    // Return to map after delay
    this.time.delayedCall(2500, () => {
      let outcome: string;
      if (isDraw) outcome = "draw";
      else if (this.battleData.winner === this.battleData.player1) outcome = "win";
      else outcome = "lose";
      this.scene.start("BattleResultScene", {
        outcome,
        winnerName: winnerCharName,
        playerName: this.playerName,
        enemyName: this.enemyName
      });
    });
  }

  private updateHealthBar(
    healthBackBar: Phaser.GameObjects.Image,
    healthText: Phaser.GameObjects.Text,
    currentHP: number
  ) {
    // Calculate health percentage
    const healthPercent = currentHP / 10;

    // Update the width of the green health bar while keeping its position fixed
    const originalWidth = 600;
    const newWidth = originalWidth * healthPercent;

    // Set the display size maintaining the height
    healthBackBar.setDisplaySize(newWidth, 100);

    // Important: Keep the x-position fixed by setting origin to right side (1, 0.5)
    // This makes it shrink from left to right while staying in place
    healthBackBar.setOrigin(0, 0.5);

    // Position adjustment to align with the brown backing bar
    if (healthBackBar === this.enemyHealthBar) {
      healthBackBar.setX(-300); // For enemy health bar (left side)
    } else {
      healthBackBar.setX(-300); // For player health bar (right side)
    }

    // Update health text
    healthText.setText(`${currentHP}/10`);
  }

  private handleBattleEnd() {
    // Use character names for win/lose
    const winnerName = this.playerHP > 0 ? this.playerName : this.enemyName;
    // Disable roll button
    if (this.rollButton) {
      this.rollButton.destroy();
    }
    // Show battle result
    this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2,
        `${winnerName} wins!`,
        {
          fontSize: "64px",
          color: "#ffffff",
        }
      )
      .setOrigin(0.5);
    // Return to map after delay
    this.time.delayedCall(2000, () => {
      this.scene.start("BattleResultScene", {
        outcome: this.playerHP > 0 ? "win" : "lose",
        winnerName,
        playerName: this.playerName,
        enemyName: this.enemyName
      });
    });
  }
}
