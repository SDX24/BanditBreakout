import { create } from "domain";
import Tile from "../Types/Tile";
import { EOL } from "os";

const eventTiles = {
    0: [0],
    1: [1, 2, 3, 6, 10, 12, 15, 18, 19, 26, 29, 31, 32, 34, 38, 39, 40, 45, 49, 51, 53, 58, 59, 63, 65, 67, 74, 81, 86, 89, 90, 98, 101],
    2: [21, 27, 33, 42, 43, 47, 52, 56, 61, 66, 70, 72, 75, 78, 79, 80, 84, 85, 91, 96, 102],
    3: [7, 14, 16, 20, 44, 50, 62, 71, 76, 87, 92],
    4: [4, 8, 9, 17, 22, 30, 36, 37, 41, 48, 55, 69, 77, 82, 83, 88, 93, 99],
    5: [11, 24, 35, 46, 64, 68, 100],
    6: [23, 25],
    7: [94, 97],
    8: [5, 13, 28, 54, 57, 60, 73]
};

const connectionRanges = [
    [0, 43],
    [44, 62],
    [63, 66],
    [67, 82],
    [83, 90],
    [91, 99],
    [100, 102]
];

const connectionPoints = [
    [5, 44],
    [9, 15],
    [13, 62],
    [55, 61],
    [60, 63],
    [28, 66],
    [28, 99],
    [39, 102],
    [100, 97],
    [88, 91],
    [54, 67],
    [79, 83],
    [73, 82],
    [57, 90]
];


export default class Map {
    tiles: Tile[];
    playerPositions: number[];

    constructor() {
        this.tiles = [];
        this.playerPositions = [];
    }

    // INITIALIZE MAP, MAIN FUNCTION
    
    public initializeMap(playerCount: number) {
        // actual tiles + 1 since there is tile 0
        this.createTiles(103);
        this.connectMap()
        this.eventMap()
        this.setPlayerPosAll(0, this.countPlayers(playerCount));
        this.updateMap()

        console.log(`Map initialized${EOL}`)
    }

    // UPDATING MAP (REFRESH)

    public updateMap() {
        //later TODO
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
        console.log(`Set player positions to start${EOL}`)
    }
    
    // helper for looking up player position
    public findPlayer(playerId: number): number {
        for (let i = 0; i < this.tiles.length; i++) {
            if (this.tiles[i].hasPlayer()) {
                let playersOnTile = this.tiles[i].getPlayersOnTile();
                if (playersOnTile.includes(playerId)) {
                    return i;
                }
            }
        }
        return -1;
    }

    // TILE RELATED METHODS

    private createTiles(tilesAmount: number) {
        for (let i = 0; i < tilesAmount; i++) {
            this.tiles.push(new Tile(i));
        }
        console.log(`Created tiles${EOL}`)
    }

    private connectTiles(from: number, to: number): void {
        this.tiles[from].connectTo(to);
        this.tiles[to].connectTo(from);
        console.log(`Connected tile ${from} to tile ${to}`)
    }

    private connectRange = (start: number, end: number) => {
        for (let i = start; i < end; i++) {
            this.connectTiles(i, i + 1);
        }
    };

    private connectMap() {
        // straigth paths
        connectionRanges.forEach(([start, end]) => {
            this.connectRange(start, end);
        });

        // intersections
        connectionPoints.forEach(([from, to]) => {
            this.connectTiles(from, to);
        });

        console.log(`Connected map${EOL}`)
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
        console.log(`Created events on map${EOL}`)
    }

}