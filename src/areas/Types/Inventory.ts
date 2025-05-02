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
        return ItemFactory.createItem(itemId, this);
    }

    private addItem(item: IItem): void {
        this.items.push(item);
    }
}