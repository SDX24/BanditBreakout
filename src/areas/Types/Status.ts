
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
    player_id: string;
    gold: number;
    health: number;
    hasEffect: boolean;
    effect: number;
    
    /**
     * Creates a new Status instance
     * 
     * @param player_id - The player this status belongs to
     * @param gold - Starting gold amount (defaults to 0)
     * @param health - Starting health points (defaults to 10)
     * @param hasEffect - Whether player starts with an effect (defaults to false)
     * @param effect - Starting effect ID (defaults to 0)
     */
    constructor(player_id: string, gold: number = 0, health: number = 10, hasEffect: boolean = false, effect: number = 0) {
        this.player_id = player_id;
        this.gold = gold;
        this.health = health;
        this.hasEffect = hasEffect;
        this.effect = effect;
    }
}