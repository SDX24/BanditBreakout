import Tile from "../Types/Tile";

export default class Map {
    tiles: Tile[];
    playerPositions: number[];

    constructor() {
        this.tiles = [];
        this.playerPositions = [];
    }

    
    public initializeMap(playerCount: number) {
        this.createTiles(100);
        this.setPlayerPosAll(0, this.countPlayers(playerCount));
        this.setEvents(2, 4, 6, 8, 23, 77)
        this.setEvent(100, "Boss")
        this.updateMap()

        console.log("Map initialized")
    }

    public updateMap() {

    }

    private countPlayers(playerCount: number) {
        let playersArray: number[] = []
        for (let i = 1; i <= playerCount; i++) {
            playersArray.push(i)
        }
        return playersArray
        console.log(`Players counted, there are ${playersArray.length}`)
    }

    private createTiles(tilesAmount: number) {
        for (let i = 0; i < tilesAmount; i++) {
            this.tiles.push(new Tile(i));
        }
        console.log("Created tiles")
    }

    private setPlayerPosAll(pos: number, playerIds: number[]) {
        let tile = this.tiles[pos];
        tile.hasPlayerOnTile = true;
        playerIds.forEach(player_Id => tile.addPlayer(player_Id))
    }


}