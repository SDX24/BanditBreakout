/**
 * Represents an item that can be collected and used in the game
 * 
 * Usability:
 * 
 * - isBattleItem
 * - isUsable
 */
export default class Item {
    id: number;
    name: string;
    description: string;
    effect: string;
    isBattleItem: boolean;
    isUsable: boolean;
    
        /**
     * Creates a new Item instance
     * 
     * @param id - Unique identifier
     * @param name - Display name
     * @param description - Detailed description
     * @param effect - Effect when used
     * 
     * @param isBattleItem - Is it made for battles (defaults to false)
     * @param isBattleItem - If true, BattleItem. If false, MapItem
     * 
     * @param isUsable - Can be used (defaults to false!!)
     */
    constructor(id: number, name: string, description: string, effect: string, isBattleItem: boolean = false) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.effect = effect;
        this.isBattleItem = isBattleItem;
        this.isUsable = false;
    }
}