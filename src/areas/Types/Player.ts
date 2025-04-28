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
  player_id: string;
  character_id: number;
  isAlive: boolean;
  status: Status;
  inventory: Item[];
  position: number;


    /**
   * Creates a new Player instance
   * 
   * @param game_id - The game session identifier
   * @param player_id - The unique player identifier
   * @param character_id - The chosen character class ID
   * @param isAlive - Whether the player is alive (defaults to true)
   * @param status - The player's status object with gold, health and effects
   * @param inventory - Initial items in inventory (defaults to empty array)
   * @param position - Starting position on the map (defaults to 0)
   */
  constructor(game_id: string, player_id: string, character_id: number, isAlive: boolean = true, status: Status, inventory: Item[] = [], position: number = 0) {
  this.game_id = game_id;
  this.player_id = player_id;
  this.character_id = character_id;
  this.isAlive = isAlive;
  this.status = status;
  this.inventory = inventory;
  this.position = position;
  }


}