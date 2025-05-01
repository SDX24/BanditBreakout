import Player from "./Player"
import Map from "../Map/Map"
import Move from "./Movement"
export default class Game {
    players: Player[]
    map: Map

    constructor() {
        this.players = []
        this.map = new Map()
    }
    

    public startGame(playerCount: number, game_id: string): void {
        console.log("Game started!")

        // create players
        for (let player = 1; player <= playerCount; player++) {
            this.players.push(new Player(this, player))
        }
        
        // create map
        this.map.initializeMap(playerCount)

    }

    
    

}