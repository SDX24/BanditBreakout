import { io, Socket } from 'socket.io-client';

export class SocketService {
  private static socket: Socket;

  static getInstance(): Socket {
    if (!SocketService.socket) {
      const url = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';
      SocketService.socket = io(url, { autoConnect: true });
    }
    return SocketService.socket;
  }
}
