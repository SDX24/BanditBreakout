
import { ITEM_LIST } from "../../../backend/areas/Types/Item";
import { Characters } from "../../../backend/areas/Types/Character";
import WebFontLoader from "webfontloader";
import { SocketService } from "../services/SocketService";



export class Gui extends Phaser.Scene {
    private socket: any;
    private playerData: any
    private itemOffset = 30;
    private itemIcons: Phaser.GameObjects.Image[] = [];
    private charIcon!: Phaser.GameObjects.Image;
    private charCircle!: Phaser.GameObjects.Graphics;
    private charMask!: Phaser.GameObjects.Arc;
    private coinText!: Phaser.GameObjects.Text;

    private headSettings: { [key: string]: { x: number; y: number; scale: number } } = {
      "buckshot": { x: 20, y: 100, scale: 250 },
      "serpy": { x: -30, y: 70, scale: 200 },
      "grit": { x: 0, y: 80, scale: 210 },
      "solstice": { x: -5, y: 50, scale: 170 },
      "scout": { x: -10, y: 80, scale: 200 },
    };

    constructor() {
      super("Gui");
    }
  
    preload() {

      const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';
      this.load.setBaseURL(serverUrl);          
      this.load.setPath('assets');     

      this.load.image("coin_icon", encodeURIComponent("gui/coin_icon.png"));
      this.load.svg("backing", encodeURIComponent("gui/backing.svg"));
      this.load.svg("banner", encodeURIComponent("gui/banner.svg"));
      this.load.svg("board", encodeURIComponent("gui/board.svg"));
      this.load.svg("frame", encodeURIComponent("gui/frame.svg"));


       const ITEM_ASSET_MAP: Record<string, string> = {
            'Lasso':               'lasso/lasso zoom.svg',
            'Shovel':              'shovel/shovel zoom.svg',
            'Vest':                'cowboy_vest/vest zoom.svg',
            'Poison Crossbow':   'poison_crossbow/crossbow zoom.svg',
            'Mirage Teleporter': 'mirage_teleporter/teleporter zoom.svg',
            'Cursed Coffin':     'cursed_coffin/Coffin zoom.svg',
            'Rigged Dice':       'rigged_dice/dice zoom.svg',
            'V.S.':              'v.s./vs zoom.svg',
            'Tumbleweed':          'tumbleweed/tumbleweed zoom.svg',
            'Magic Carpet':      'magic_carpet/carpet zoom.svg',
            'Wind Staff':        'wind_staff/staff zoom.svg',
            };




      ITEM_LIST.forEach(item => {

        this.load.svg(item.name.toLowerCase(), encodeURIComponent(ITEM_ASSET_MAP[item.name]));
      })
      Characters.forEach(char => {
        this.load.svg(char.name.toLowerCase(), encodeURIComponent(`character_asset/${char.name.toLowerCase()}Front.svg`));
      });

      WebFontLoader.load({
            custom: {
              families: ['Wellfleet', 'WBB'],
              urls: ['/fonts.css']
            }
          });
    }
  
    create(data: { gameId: string, playerId: number, characterId: number }) {
      this.playerData = data;
      let characterId = this.playerData.characterId;
      characterId--;
      const board = this.add.image(290, 930, "board");
      board.setDisplaySize(board.width * 0.3, board.height * 0.3);
      
      const backing = this.add.image(250, 930, "backing");
      backing.setDisplaySize(backing.width * 0.2, backing.height * 0.2);
      
      const iconX = 140;
      const iconY = 915;
      const circleRadius = 80;

      const charName = Characters[characterId]?.name?.toLowerCase() ?? Characters[0].name.toLowerCase();
      const headSettings = this.headSettings[charName];

      // Add character head image with settings
      this.charIcon = this.add.image(iconX + headSettings.x, iconY + headSettings.y, charName);
      this.charIcon.setDisplaySize(headSettings.scale, headSettings.scale * 1.3);

      // Create a circular mask for the icon
      this.charMask = this.add.circle(iconX, iconY, circleRadius, 0xffffff, 1).setVisible(false);
      const mask = this.charMask.createGeometryMask();
      this.charIcon.setMask(mask);

      const frame = this.add.image(iconX + 112, iconY + 15, "frame");
      frame.setDisplaySize(frame.width * 0.21, frame.height * 0.21);

      const banner = this.add.image(iconX + 155, iconY + 10, "banner");
      banner.setDisplaySize(banner.width * 0.3, banner.height * 0.3);

      const bannerText = this.add.text(iconX, iconY + 75, Characters[characterId].name, {
        fontFamily: "WBB",
        fontSize: 32,
        color: "#000000",
        align: "center",
      });
      bannerText.setOrigin(0.5, 0.5);

      const coinIcon = this.add.image(iconX + 100, iconY - 45, "coin_icon");
      coinIcon.setDisplaySize(coinIcon.width * 0.03, coinIcon.height * 0.03);

      this.coinText = this.add.text(iconX + 135, iconY - 45, "0", {
        fontFamily: "Wellfleet",
        fontSize: 40,
        color: "#492807",
        align: "center",
      });
      this.coinText.setOrigin(0.5, 0.5);

      const guiContainer = this.add.container(0, 0);
      guiContainer.add([board, backing, this.charIcon, frame, banner, bannerText, coinIcon, this.coinText, ...this.itemIcons]);

      // Listen for updates to player status
      this.events.on('updatePlayerStatus', (statusData: any) => {
        console.log('Updating Gui with new player status:', statusData);
        this.coinText.setText(statusData.gold.toString());
        // Additional UI updates for health, effects, etc., can be added here
      }, this);

      this.addListeners();
    }

private addListeners() {
  this.socket = SocketService.getInstance();
  this.socket.on("statusChange", (data: { gameId: string, playerId: number, resource: string, value: number }) => {
      if (data.playerId === this.playerData.playerId && data.gameId === this.playerData.gameId) {
        if (data.resource === "gold") {
          this.coinText.setText(data.value.toString());
        } else if (data.resource === "item") {
          this.addNextItemIcon(data.value);
        }
      }
  });
}
    private addNextItemIcon(index: number) {

      const item = ITEM_LIST[index];
      if (!item) {
        console.warn(`Item with index ${index} not found in ITEM_LIST`);
        return;
      }
      const newIcon = this.add.image(240 + this.itemOffset, 935, item.name.toLowerCase());
      newIcon.setDisplaySize(newIcon.width * 0.09, newIcon.height * 0.09);
      newIcon.setInteractive({ useHandCursor: true });

      newIcon.on('pointerdown', () => {
          this.socket.emit("useItem", { gameId: this.playerData.gameId, playerId: this.playerData.playerId, itemId: index });
          newIcon.destroy();
          this.itemIcons = this.itemIcons.filter(icon => icon !== newIcon);
          this.itemOffset -= 70;
      });

      this.itemIcons.push(newIcon);
      
      const guiContainer = this.children.getByName('guiContainer') as Phaser.GameObjects.Container;
      if (guiContainer) {
          guiContainer.add(newIcon);
      }

      this.itemOffset += 70; 
  }

}
