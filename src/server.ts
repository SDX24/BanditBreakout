import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { Game } from './areas/Types/Game';
import { connectToDatabase } from './db/mongoose';
import { createGame, addPlayerToGame } from './db/operations/gameOps';
import { createPlayer, updatePlayerPosition, updatePlayerStatus } from './db/operations/playerOps';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow any origin for now, restrict in production
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;

// Store active games in memory for quick access
const activeGames: { [key: string]: Game } = {};

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Handle game creation
  socket.on('createGame', async (gameId: string, name: string) => {
    try {
      const newGame = await createGame(gameId, name);
      activeGames[gameId] = new Game();
      socket.join(gameId);
      socket.emit('gameCreated', { gameId, name });
      console.log(`Game created: ${gameId}`);
    } catch (error) {
      socket.emit('error', { message: 'Failed to create game' });
      console.error('Error creating game:', error);
    }
  });

  // Handle player joining
  socket.on('joinGame', async (gameId: string, playerId: number) => {
    if (!activeGames[gameId]) {
      socket.emit('error', { message: 'Game does not exist' });
      return;
    }
    try {
      await addPlayerToGame(gameId, playerId);
      await createPlayer(gameId, playerId);
      socket.join(gameId);
      socket.emit('joinedGame', { gameId, playerId });
      io.to(gameId).emit('playerJoined', { playerId });
      console.log(`Player ${playerId} joined game ${gameId}`);
    } catch (error) {
      socket.emit('error', { message: 'Failed to join game' });
      console.error('Error joining game:', error);
    }
  });

  // Handle player movement
  socket.on('movePlayer', async (gameId: string, playerId: number, position: number) => {
    if (!activeGames[gameId]) {
      socket.emit('error', { message: 'Game does not exist' });
      return;
    }
    try {
      await updatePlayerPosition(playerId, position);
      io.to(gameId).emit('playerMoved', { playerId, position });
      console.log(`Player ${playerId} moved to position ${position} in game ${gameId}`);
    } catch (error) {
      socket.emit('error', { message: 'Failed to move player' });
      console.error('Error moving player:', error);
    }
  });

  // Handle player status update
  socket.on('updateStatus', async (gameId: string, playerId: number, status: any) => {
    if (!activeGames[gameId]) {
      socket.emit('error', { message: 'Game does not exist' });
      return;
    }
    try {
      await updatePlayerStatus(playerId, status);
      io.to(gameId).emit('statusUpdated', { playerId, status });
      console.log(`Player ${playerId} status updated in game ${gameId}`);
    } catch (error) {
      socket.emit('error', { message: 'Failed to update status' });
      console.error('Error updating status:', error);
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    // Optionally, handle player disconnection from game
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// Connect to MongoDB
connectToDatabase().catch(err => {
  console.error('Failed to connect to database:', err);
});
