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
        this.createTiles(100);
        this.setPlayerPosAll(0, this.countPlayers(playerCount));
        this.setEventOfType()
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
        console.log(`Connected tile ${from} to tile ${to}`)
    }

    private setEventOfType() {
        
    }

}