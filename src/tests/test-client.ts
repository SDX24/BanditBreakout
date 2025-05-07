import { io, Socket } from 'socket.io-client';
import readline from 'readline';

const SOCKET_URL = 'http://localhost:6006'; // Adjust if your server runs on a different port

// Create a readline interface for command-line input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to prompt user for input
const prompt = (question: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
};

// Main test client class
class TestClient {
  private socket: Socket;
  private gameId: string = 'TEST_GAME';
  private playerId: number = 1;

  constructor() {
    this.socket = io(SOCKET_URL);
    this.setupSocketListeners();
  }

  private setupSocketListeners(): void {
    this.socket.on('connect', () => {
      console.log('Connected to server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    this.socket.on('gameCreated', (data) => {
      console.log('Game created:', data);
    });

    this.socket.on('joinedGame', (data) => {
      console.log('Joined game:', data);
    });

    this.socket.on('playerJoined', (data) => {
      console.log('Player joined:', data);
    });

    this.socket.on('playerMoved', (data) => {
      console.log('Player moved:', data);
    });

    this.socket.on('tileEventTriggered', (data) => {
      console.log('Tile event triggered:', data);
    });

    this.socket.on('itemObtained', (data) => {
      console.log('Item obtained:', data);
    });

    this.socket.on('itemUsed', (data) => {
      console.log('Item used:', data);
    });

    this.socket.on('resourceUpdated', (data) => {
      console.log('Resource updated:', data);
    });

    this.socket.on('error', (error) => {
      console.error('Error:', error);
    });
  }

  public async run(): Promise<void> {
    while (true) {
      console.log('\nAvailable commands:');
      console.log('1. createGame - Create a new game');
      console.log('2. joinGame - Join an existing game');
      console.log('3. moveTo - Move player to a specific position');
      console.log('4. moveFront - Move player forward by steps');
      console.log('5. diceRoll - Roll dice to move player');
      console.log('6. obtainItem - Obtain an item');
      console.log('7. useItem - Use an item');
      console.log('8. updateResource - Update gold or health');
      console.log('9. setGameId - Set game ID');
      console.log('10. setPlayerId - Set player ID');
      console.log('11. exit - Exit the test client');

      const choice = await prompt('Enter command number: ');

      switch (choice) {
        case '1':
          await this.createGame();
          break;
        case '2':
          await this.joinGame();
          break;
        case '3':
          await this.movePlayerTo();
          break;
        case '4':
          await this.movePlayerFront();
          break;
        case '5':
          await this.movePlayerDiceRoll();
          break;
        case '6':
          await this.obtainItem();
          break;
        case '7':
          await this.useItem();
          break;
        case '8':
          await this.updateResource();
          break;
        case '9':
          this.gameId = await prompt('Enter Game ID: ');
          console.log(`Game ID set to: ${this.gameId}`);
          break;
        case '10':
          const playerIdInput = await prompt('Enter Player ID: ');
          this.playerId = parseInt(playerIdInput, 10);
          console.log(`Player ID set to: ${this.playerId}`);
          break;
        case '11':
          console.log('Exiting...');
          this.socket.disconnect();
          rl.close();
          return;
        default:
          console.log('Invalid command. Please try again.');
      }
    }
  }

  private async createGame(): Promise<void> {
    const name = await prompt('Enter game name (default: Test Game): ') || 'Test Game';
    const playerCountInput = await prompt('Enter player count (default: 4): ') || '4';
    const playerCount = parseInt(playerCountInput, 10);
    this.socket.emit('createGame', this.gameId, name, playerCount);
    console.log(`Creating game with ID: ${this.gameId}, Name: ${name}, Players: ${playerCount}`);
  }

  private async joinGame(): Promise<void> {
    this.socket.emit('joinGame', this.gameId, this.playerId);
    console.log(`Joining game ${this.gameId} as Player ${this.playerId}`);
  }

  private async movePlayerTo(): Promise<void> {
    const positionInput = await prompt('Enter position to move to: ');
    const position = parseInt(positionInput, 10);
    this.socket.emit('movePlayerTo', this.gameId, this.playerId, position);
    console.log(`Moving Player ${this.playerId} to position ${position}`);
  }

  private async movePlayerFront(): Promise<void> {
    const stepsInput = await prompt('Enter number of steps forward: ');
    const steps = parseInt(stepsInput, 10);
    this.socket.emit('movePlayerFront', this.gameId, this.playerId, steps);
    console.log(`Moving Player ${this.playerId} forward by ${steps} steps`);
  }

  private async movePlayerDiceRoll(): Promise<void> {
    this.socket.emit('movePlayerDiceRoll', this.gameId, this.playerId);
    console.log(`Rolling dice for Player ${this.playerId}`);
  }

  private async obtainItem(): Promise<void> {
    const itemIdInput = await prompt('Enter item ID to obtain (default: 8 for Tumbleweed): ') || '8';
    const itemId = parseInt(itemIdInput, 10);
    this.socket.emit('obtainItem', this.gameId, this.playerId, itemId);
    console.log(`Obtaining item ${itemId} for Player ${this.playerId}`);
  }

  private async useItem(): Promise<void> {
    const itemIdInput = await prompt('Enter item ID to use (default: 8 for Tumbleweed): ') || '8';
    const itemId = parseInt(itemIdInput, 10);
    this.socket.emit('useItem', this.gameId, this.playerId, itemId);
    console.log(`Using item ${itemId} for Player ${this.playerId}`);
  }

  private async updateResource(): Promise<void> {
    const resource = await prompt('Enter resource (gold/health, default: gold): ') || 'gold';
    const action = await prompt('Enter action (e.g., +5, -3, =10, default: +5): ') || '+5';
    this.socket.emit('updateResource', this.gameId, this.playerId, resource, action);
    console.log(`Updating ${resource} with action ${action} for Player ${this.playerId}`);
  }
}

// Run the test client
const client = new TestClient();
client.run().catch((err) => {
  console.error('Error running test client:', err);
  rl.close();
});
