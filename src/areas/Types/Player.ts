import Status from './Status';
import Item from './Item';
import Tile from './Tile';

/**
 * Represents a player on the map
 * 
 * Contains:
 * 
 * - Game id
 * - Health, gold, effects, items
 * - Is the player alive
 * - Current position
 */
export default class Player {
  game_id: string;
  id: number;
  character_id: number;
  isAlive: boolean;
  status: Status;
  inventory: Item[];
  position: number;


    /**
   * Creates a new Player instance
   * 
   * @param game_id - The game session identifier. Set to "" by default
   * @param id - The unique player identifier. Set to 0 by default
   * @param character_id - The chosen character class ID. Set to 0 by default
   * @param isAlive - Whether the player is alive (defaults to true)
   * @param status - The player's status object with gold, health and effects
   * @param inventory - Initial items in inventory (defaults to empty array)
   * @param position - Starting position on the map (defaults to 0)
   */
    constructor(game_id: string, id: number) {
        this.game_id = game_id;
        this.id = id;
        this.character_id = 0;
        this.isAlive = true;
        this.status = new Status(this.id);
        this.inventory = [];
        this.position = 0;
      } 

    //  GAME RELATED METHODS
    
    // PICK CHARACTER

    public pickCharacter(character_id: number) {
    this.character_id = character_id;
    }

    // KILL PLAYER

    public killPlayer() {
    this.isAlive = false;
    }

    // STATUS RELATED METHODS



    // GOLD AND HEALTH MANAGEMENT

  /**
   * Manage player's gold using string commands
   * @param action - Command string: "+5" (add 5), "-5" (remove 5), "=5" (set to 5)
   * @returns Current gold amount after operation
   */
  public gold(action: string): number {
    return this._manageResource(action, 'gold');
  }

  /**
   * Manage player's health using string commands
   * @param action - Command string: "+5" (heal 5), "-5" (damage 5), "=5" (set to 5)
   * @returns Current health amount after operation
   */
  public health(action: string): number {
    const result = this._manageResource(action, 'health');
    
    if (this.status.health <= 0) {
      this.killPlayer();
    }
    
    return result;
  }
  
  private _manageResource(action: string, resourceType: 'gold' | 'health'): number {
    const firstChar = action.charAt(0);
    const amount = parseInt(action.substring(1));
    
    if (firstChar === '+') {
      this.status[resourceType] += amount;

    } else if (firstChar === '-') {
      this.status[resourceType] = Math.max(0, this.status[resourceType] - amount);

    } else if (firstChar === '=') {
      this.status[resourceType] = amount;

    }
    
    return this.status[resourceType];
  }

    public getGold() {
    return this.status.gold;
    }

    public getHealth() {
    return this.status.health;
    }


    // EFFECTS
    
    public effectGet() {
    return this.status.effects;
    }
    
    public effectSet(effects: string[]) {
    this.status.effects = effects;
    }

    public effectAdd(effect: string) {
    this.status.effects.push(effect);
    }

    public effectRemove(effect: string) {
    const index = this.status.effects.indexOf(effect);
    if (index > -1) {
        this.status.effects.splice(index, 1);
    }
    }

    // INVENTORY RELATED METHODS

    public inventoryGet() {
    return this.inventory;
    }

    public inventorySet(inventory: Item[]) {
    this.inventory = inventory;
    }

    public inventoryAdd(item: Item) {
    this.inventory.push(item);
    }

    public inventoryRemove(item: Item) {
    const index = this.inventory.indexOf(item);
    if (index > -1) {
        this.inventory.splice(index, 1);
    }
    }

    // POSITION RELATED METHODS

    public positionGet() {
    return this.position;
    }

    private positionSet(position: number) {
    this.position = position;
    }

}