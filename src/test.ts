import Map from "./areas/Map/Map";
import Game from "./areas/Types/Game";
import Player from "./areas/Types/Player";

const game = new Game();

game.startGame(4, "ABC123");

let p1 = game.players[0]

let tile0 = game.map.tiles[0]
let tile3 = game.map.tiles[3]
let tile6 = game.map.tiles[6]
console.log("Map tile 3:")
console.log(tile3.playersOnTile)
    
p1.inventory.obtain(8)
p1.inventory.useItem(8)

console.log("Map tile 3:")
console.log(tile3.playersOnTile)

console.log("Map tile 6:")
console.log(tile6.playersOnTile)

p1.inventory.obtain(8)
p1.inventory.useItem(8)

console.log("Map tile 6:")
console.log(tile6.playersOnTile)

// console.log("Game started with players:")
// console.log(game.players)

// console.log("Players are at positions:")
// console.log(game.map.playerPositions)

// let tile0 = game.map.tiles[0]

// console.log("Map tile 0:")
// console.log(tile0)

// console.log("map tile 5 players:")
// console.log(game.map.tiles[5].playersOnTile)

// let p1 = game.players[0]
// p1.move.front(5)

// console.log("map tile 5 players:")
// console.log(game.map.tiles[5].playersOnTile)

// console.log("map tile 2 players:")
// console.log(game.map.tiles[2].playersOnTile)

// let p2 = game.players[1]
// p2.move.to(2)

// console.log("map tile 2 players:")
// console.log(game.map.tiles[2].playersOnTile)

// p1.move.back(1)

// console.log("map tile 4 players:")
// console.log(game.map.tiles[4].playersOnTile)





// console.log("***")
// console.log("***")
// console.log("***")

// console.log("Testing event")
// let p1 = game.players[0]
// console.log("Player 1's gold:")
// console.log(p1.getGold())
// console.log("Player 1 steping on safe")
// game.move.playerTo(1, 2)
// console.log("Player 1's gold:")
// console.log(p1.getGold())


//note the player positions are empty because tiles have them. they need to be link somehow TODO