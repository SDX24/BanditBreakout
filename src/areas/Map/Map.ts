import { create } from "domain";
import Tile from "../Types/Tile";

const eventTiles = {
    0: [0],
    1: [1, 2, 3, 6, 7, 11, 13, 16, 19, 20, 26, 30, 32, 33, 35, 39, 40, 41, 46, 50, 52, 54, 59, 60, 64, 66, 68, 73, 76, 83, 88, 91, 92, 100, 102],
    2: [22, 28, 34, 43, 48, 53, 57, 62, 67, 71, 74, 77, 80, 81, 82, 86, 87, 93, 98, 104],
    3: [8, 15, 17, 21, 45, 51, 63, 72, 78, 89, 94],
    4: [4, 9, 10, 18, 23, 31, 37, 38, 42, 49, 56, 70, 79, 84, 85, 90, 96, 101],
    5: [12, 25, 36, 47, 65, 69, 95, 103],
    6: [24, 27],
    7: [97, 99],
    8: [5, 14, 29, 55, 58, 61, 75]
};


export default class Map {
    tiles: Tile[];
    playerPositions: number[];

    constructor() {
        this.tiles = [];
        this.playerPositions = [];
    }

    // INITIALIZE MAP, MAIN FUNCTION
    
    public initializeMap(playerCount: number) {
        this.createTiles(105);
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

    private eventMap() {
        Object.entries(eventTiles).forEach(([type, indexes]) => {
            indexes.forEach(index => this.createEventOfType(parseInt(type), index));
        });
        console.log("Created events on map")
    }

}