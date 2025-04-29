import { create } from "domain";
import Tile from "../Types/Tile";

export default class Map {
    tiles: Tile[];
    playerPositions: number[];

    constructor() {
        this.tiles = [];
        this.playerPositions = [];
    }

    // INITIALIZE MAP, MAIN FUNCTION
    
    public initializeMap(playerCount: number) {
        this.createTiles(104);
        this.connectMap()
        this.eventMap()
        this.setPlayerPosAll(0, this.countPlayers(playerCount));
        this.updateMap()

        console.log("Map initialized")
    }

    // UPDATING MAP (REFRESH)

    public updateMap() {

    }

    // PRIVATE METHODS FOR INITIALIZATION

    // PLAYERS RELATED METHODS

    private countPlayers(playerCount: number) {
        let playersArray: number[] = []
        for (let i = 1; i <= playerCount; i++) {
            playersArray.push(i)
        }
        return playersArray
        console.log(`Players counted, there are ${playersArray.length}`)
    }
    
    private setPlayerPosAll(pos: number, playerIds: number[]) {
        let tile = this.tiles[pos];
        tile.hasPlayerOnTile = true;
        playerIds.forEach(player_Id => tile.addPlayer(player_Id))
        console.log(`Set player positions to start`)
    }

    // TILE RELATED METHODS

    private createTiles(tilesAmount: number) {
        for (let i = 0; i < tilesAmount; i++) {
            this.tiles.push(new Tile(i));
        }
        console.log("Created tiles")
    }

    private connectTiles(from: number, to: number): void {
        this.tiles[from].connectTo(to);
        this.tiles[to].connectTo(from);
    }

    private connectRange = (start: number, end: number) => {
        for (let i = start; i < end; i++) {
            this.connectTiles(i, i + 1);
        }
    };

    private connectMap() {
        // straigth paths
        this.connectRange(45, 63);
        this.connectRange(64, 67);
        this.connectRange(0, 44);
        this.connectRange(68, 84);
        this.connectRange(85, 92);
        this.connectRange(93, 101);
        this.connectRange(102, 104);

        // intersections
        this.connectTiles(5, 45);
        this.connectTiles(14, 63);
        this.connectTiles(61, 64);
        this.connectTiles(29, 67);
        this.connectTiles(29, 101);
        this.connectTiles(40, 104);
        this.connectTiles(102, 99);
        this.connectTiles(90, 93);
        this.connectTiles(55, 68);
        this.connectTiles(81, 85);
        this.connectTiles(58, 92);

        console.log("Connected map")
    }


    private createEventOfType(type: number, tileIndex: number) {
        let tile = this.tiles[tileIndex];
        tile.setEvent(type);
        console.log(`Set event of type ${type} on tile ${tileIndex}`)
        
    }

    private createEventRange = (start: number, end: number, type: number) => {
        for (let i = start; i < end; i++) {
            this.createEventOfType(type, i)
        }
    };

    private eventMap() {
        // events go from 1 - 8

        this.createEventRange(0, 5, 0);

    }

}