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
        const currentPos = this.game.map.findPlayer(playerId);
        
        if (currentPos !== -1) {
            this.game.map.tiles[currentPos].removePlayer(playerId);
            this.game.map.tiles[tile].addPlayer(playerId);
            
            this.game.map.tiles[tile].getEvent().onStep(playerId, this.game);
            
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

    /**
     * Swaps two players on the map
     * @param player1 - The ID of the first player to swap
     * @param player2 - The ID of the second player to swap
     */
    public swap(player1: number, player2: number): void {
        const tile1 = this.game.map.findPlayer(player1);
        const tile2 = this.game.map.findPlayer(player2);

        if (tile1 !== -1 && tile2 !== -1) {
            this.playerTo(player1, tile2);
            this.playerTo(player2, tile1);
            console.log(`Swapped players ${player1} and ${player2}`);
        } else {
            console.error(`One or both players not found on the map.`);
        }
    }

    public front(playerId: number, by: number): void {
        const startTile = this.game.map.findPlayer(playerId);
        
    }

    
}