import Player from "./Player"
import Map from "../Map/Map"
import Move from "./Movement"
export default class Game {
    players: Player[]
    map: Map
    move: Move

    constructor() {
        this.players = []
        this.map = new Map()
        this.move = new Move(this)
    }
    

    public startGame(playerCount: number, game_id: string): void {
        console.log("Game started!")

        // create players
        for (let player = 1; player <= playerCount; player++) {
            this.players.push(new Player(game_id, player))
        }
        
        // create map
        this.map.initializeMap(playerCount)

    }

    
    

}