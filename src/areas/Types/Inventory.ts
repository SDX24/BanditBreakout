import Player from "./Player";
import Game from "./Game";
import { IItem, ItemFactory } from "./Item";

export default class Inventory {
    private player: Player;
    private game: Game;
    items: IItem[]
    
    constructor(player: Player) {
        this.player = player;
        this.game = this.player.game;
        this.items = [];
    }

    public obtain(itemId: number) {
        const item = this.makeItem(itemId);
        this.addItem(item);
        console.log(`Player ${this.player.id} obtained item: ${item.name}`);
    }

    private makeItem(itemId: number): IItem {
        return ItemFactory.createItem(itemId, this.player);
    }

    private addItem(item: IItem): void {
        this.items.push(item);
    }

    public hasItem(itemId: number): boolean {
        if (this.items.find(item => item.id === itemId)) {
            return true;
        }
        return false;
    }

    private findItem(itemId: number): IItem | null {
        const item = this.items.find(item => item.id === itemId);
        if (item) {
            return item;
        } else {
            console.log(`Item with ID ${itemId} not found in inventory.`);
            return null;
        }
    }


/**
  * Uses an item from the inventory
  * 
  * @param itemId - item id to use (If they have it)
  * - 0: LassoItem
  * - 1: ShovelItem
  * - 2: VestItem
  * - 3: PoisonCrossbowItem
  * - 4: MirageTeleporterItem
  * - 5: CursedCoffinItem
  * - 6: RiggedDiceItem
  * - 7: VSItem
  * - 8: TumbleweedItem
  * - 9: MagicCarpetItem
  * - 10: WindStaffItem
  */
    public useItem(itemId: number): void {
        const item = this.findItem(itemId);
        if (item) {
            item.use();
            console.log(`Player ${this.player.id} used item: ${item.name}`);
        } else {
        }
    }
}