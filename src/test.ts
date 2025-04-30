import Map from "./areas/Map/Map";
import Game from "./areas/Types/Game";
import Player from "./areas/Types/Player";

const game = new Game();

game.startGame(4, "ABC123");

console.log("Game started with players:")
console.log(game.players)

console.log("Players are at positions:")
console.log(game.map.playerPositions)

let tile0 = game.map.tiles[0]

console.log("Map tile 0:")
console.log(tile0)

console.log("Map tile 1:")
console.log(game.map.tiles[1])



//note the player positions are empty because tiles have them. they need to be link somehow TODO