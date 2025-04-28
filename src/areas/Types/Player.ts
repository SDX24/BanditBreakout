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
  player_id: number;
  character_id: number;
  isAlive: boolean;
  status: Status;
  inventory: Item[];
  position: number;


    /**
   * Creates a new Player instance
   * 
   * @param game_id - The game session identifier. Set to "" by default
   * @param player_id - The unique player identifier. Set to 0 by default
   * @param character_id - The chosen character class ID. Set to 0 by default
   * @param isAlive - Whether the player is alive (defaults to true)
   * @param status - The player's status object with gold, health and effects
   * @param inventory - Initial items in inventory (defaults to empty array)
   * @param position - Starting position on the map (defaults to 0)
   */
    constructor(game_id: string, player_id: number) {
        this.game_id = game_id;
        this.player_id = player_id;
        this.character_id = 0;
        this.isAlive = true;
        this.status = new Status(this.player_id);
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

    // GOLD

    public goldGet() {
    return this.status.gold;
    }

    public goldSet(gold: number) {
    this.status.gold = gold;
    }

    public goldAdd(gold: number) {
    this.status.gold += gold;
    }

    public goldRemove(gold: number) {
    this.status.gold -= gold;
    }

    // HEALTH
    
    public healthGet() {
    return this.status.health;
    }

    public healthSet(health: number) {
    this.status.health = health;
    }

    public healthAdd(health: number) {
    this.status.health += health;
    }

    public healthRemove(health: number) {
    this.status.health -= health;
    }
    
    // EFFECTS
    
    public effectGet() {
    return this.status.effects;
    }
    
    public effectSet(effects: number[]) {
    this.status.effects = effects;
    }

    public effectAdd(effect: number) {
    this.status.effects.push(effect);
    }

    public effectRemove(effect: number) {
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

    public positionSet(position: number) {
    this.position = this.position;
    }

}