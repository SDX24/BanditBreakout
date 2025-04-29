
/**
 * Represents a player's current status
 * 
 * Status tracks:
 * 
 * - Health
 * - Gold
 * - If there is an effect active
 * - Effect
 */
export default class Status {
    player_id: number;
    gold: number;
    health: number;
    hasEffect: boolean;
    effects: string[];
    
    /**
     * Creates a new Status instance
     * 
     * @param player_id - The player this status belongs to
     * @param gold - The amount of gold the player has (defaults to 0)
     * @param health - The player's current health (defaults to 10)
     * @param hasEffect - Whether the player has an active effect (defaults to false)
     * @param effects - Array of effect IDs (defaults to empty array)
     */
    constructor(player_id: number) {
        this.player_id = player_id;
        this.gold = 0;
        this.health = 10;
        this.hasEffect = false;
        this.effects = [];
    }
}