import Game from './Game';
import Player from './Player';

export default class Movement {
    private game: Game;
    
    constructor(game: Game) {
        this.game = game;
    }
    
    /**
     * Moves a specific player to a specific Tile
     * @param playerId - The ID of the player to move
     * @param tile - The tile index
     */
    public playerTo(playerId: number, tile: number): void {
        
        const player = this.game.players[playerId];
        let currentPos = this.game.map.findPlayer(playerId)
        if (currentPos !== -1) {
            this.game.map.tiles[currentPos].removePlayer(playerId);
            this.game.map.tiles[tile].addPlayer(playerId);
            console.log(`Moved player ${playerId} to tile ${tile}`);
        } else {
            console.error(`Player ${playerId} not found on the map. Dead or not in the game.`);
        }
    }
    
    /**
     * Moves all players to a specific Tile
     * @param tile - The tile index
     */
    public allTo(tile: number): void {
        for (const player of this.game.players) {
            this.playerTo(player.id, tile);
        }
    }
    
}