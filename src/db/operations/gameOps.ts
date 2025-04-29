import { GameModel } from '../models/GameModel';

export async function createGame(game_id: string, name: string) {
    try {
        const newGame = new GameModel({
            game_id,
            name
        });
        await newGame.save();
        return newGame;
    } catch (error) {
        console.error('Error creating game:', error);
        throw error;
    }
}

export async function getGame(game_id: string) {
    try {
        const game = await GameModel.findOne({ game_id });
        return game;
    } catch (error) {
        console.error('Error getting game:', error);
        throw error;
    }
}

export async function addPlayerToGame(game_id: string, player_id: number) {
    try {
        const game = await GameModel.findOneAndUpdate(
            { game_id },
            { $push: { players: player_id } },
            { new: true }
        );
        return game;
    } catch (error) {
        console.error('Error adding player to game:', error);
        throw error;
    }
}

export async function updateGameMap(game_id: string, tiles: any[]) {
    try {
        const game = await GameModel.findOneAndUpdate(
            { game_id },
            { 'map.tiles': tiles },
            { new: true }
        );
        return game;
    } catch (error) {
        console.error('Error updating game map:', error);
        throw error;
    }
}
