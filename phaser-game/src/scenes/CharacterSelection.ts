import Phaser from "phaser";
import { Characters, ICharacter } from "backend/areas/Types/Character"

export class CharacterSelection extends Phaser.Scene {
  private overlayBacking!: Phaser.GameObjects.Image;
  private overlayFrame!: Phaser.GameObjects.Image;
  private overlayPage!: Phaser.GameObjects.Image;
  private overlayBackSign!: Phaser.GameObjects.Image;
  private charSign!: Phaser.GameObjects.Image;
  private charNameText!: Phaser.GameObjects.Text;
  private charDescriptionText!: Phaser.GameObjects.Text;
  private charIndex: number = 0;
  private leftKey!: Phaser.Input.Keyboard.Key;
  private rightKey!: Phaser.Input.Keyboard.Key;
  private aKey!: Phaser.Input.Keyboard.Key;
  private dKey!: Phaser.Input.Keyboard.Key;
  private characterCircles: Phaser.GameObjects.Container[] = [];


  constructor() {
    super("CharacterSelection");
  }

  preload() {
    this.load.image("overlayBacking", "tempAssets/backing.png");
    this.load.image("overlayFrame", "tempAssets/frame.png");
    this.load.image("overlayPage", "tempAssets/page.png");
    this.load.image("ovelayBackSign", "tempAssets/backSign.png");
    this.load.image("charSign", "tempAssets/charSign.png");
    this.load.font("WBB", "fonts/WesternBangBang-Regular.ttf");
}

  create() {
    //screen
    const screen = this.add.container(0, 0);

    const background = this.add.graphics().fillStyle(0x573912).fillRect(0, 0, 1920, 1080);
    screen.add(background);

    const overlayBackSign = this.add.image(0, 0, "ovelayBackSign");
    screen.add(overlayBackSign);

    const containerMain = this.add.container(960, 540);
    screen.add(containerMain);

    //containerMain
    const overlayBackground = this.add.image(0, 0, "overlayBacking");
    containerMain.add(overlayBackground);

    //containerLeft
    const containerLeft = this.add.container(-450, 0);
    containerMain.add(containerLeft);

    const overlayFrame = this.add.image(0, 0, "overlayFrame");
    containerLeft.add(overlayFrame);

    //containerRight
    const containerRight = this.add.container(450, 0);
    containerMain.add(containerRight);

    const overlayPage = this.add.image(0, 0, "overlayPage");
    containerRight.add(overlayPage);

    //containerCharDescription
    const containerCharDescription = this.add.container(-200, -100);
    containerCharDescription.setScale(0.5);
    containerRight.add(containerCharDescription);

    this.charNameText = this.add.text(0, 0, "charName", {
        fontFamily: "WBB",
        fontSize: 250,
        color: "#492807",
    });
    containerCharDescription.add(this.charNameText);

    this.charDescriptionText = this.add.text(0, 0, "charDesc", {
        fontFamily: "WBB",
        fontSize: 100,
        color: "#492807",
    });
    containerCharDescription.add(this.charDescriptionText);

    //containerCharSign
    const containerCharSign = this.add.container(0, 220);
    containerCharSign.setScale(0.5);
    containerRight.add(containerCharSign);
    
    const overlayCharSign = this.add.image(0, 0, "charSign");
    containerCharSign.add(overlayCharSign);
    
    const charSignText = this.add.text(-200, -230, "Select", {
        fontFamily: "WBB",
        fontSize: 250,
        color: "#492807",
    });
    containerCharSign.add(charSignText);

    //containerBottom
    const containerBottom = this.add.container(960, 980);
    screen.add(containerBottom);

    const containerCharIcon = this.add.container(0, 0);
    containerBottom.add(containerCharIcon);

    // Interactions
    this.leftKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.rightKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    this.aKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.dKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    this.createCharacterCircles(containerBottom);
  
    this.updateCharacterDisplay(0);
  }

  // make character circles and add updateCharDisplay func on click
  private createCharacterCircles(parent: Phaser.GameObjects.Container) {
    const circleSpacing = 120;
    const startX = -((Characters.length - 1) * circleSpacing) / 2;
    
    for (let i = 0; i < Characters.length; i++) {
      const containerCharIcon = this.add.container(startX + i * circleSpacing, 0);
      parent.add(containerCharIcon);
      
      const charCircle = this.add.graphics()
        .fillStyle(0xB7B7B7)
        .fillCircle(0, 0, 50);
      
      const hitArea = new Phaser.Geom.Circle(0, 0, 50);
      containerCharIcon.setInteractive(hitArea, Phaser.Geom.Circle.Contains);
      
      containerCharIcon.add(charCircle);
      
      containerCharIcon.on('pointerdown', () => {
        this.updateCharacterDisplay(i);
      });
      
      this.characterCircles.push(containerCharIcon);
    }
    
    this.highlightSelectedCircle(0);
  }
  
  // highlight selected (darken others)
  private highlightSelectedCircle(index: number) {
    
    this.characterCircles.forEach((container, i) => {
      const circle = container.getAt(0) as Phaser.GameObjects.Graphics;
      circle.clear();
      circle.fillStyle(i === index ? 0xB7B7B7 : 0x575757);
      circle.fillCircle(0, 0, 50);
    });
  }

  // update text for char and highlight
  private updateCharacterDisplay(index: number) {
    if (index >= 0 && index < Characters.length) {
      
      this.charIndex = index;
 
      this.charNameText.setText(Characters[index].name);
      this.charDescriptionText.setText(Characters[index].description);
      
      this.highlightSelectedCircle(index);
    }
  }

// this is for going to 0 after end and vise versa
  private changeCharacter(direction: number) {
    
    const newIndex = (this.charIndex + direction + Characters.length) % Characters.length;
    this.updateCharacterDisplay(newIndex);
  }

  update() {
    
    //prev char
    if (Phaser.Input.Keyboard.JustDown(this.leftKey) || Phaser.Input.Keyboard.JustDown(this.aKey)) {
      this.changeCharacter(-1);
    }
    
    //next char
    if (Phaser.Input.Keyboard.JustDown(this.rightKey) || Phaser.Input.Keyboard.JustDown(this.dKey)) {
      this.changeCharacter(1);
    }
    
  }


}