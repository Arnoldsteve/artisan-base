import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: '/chat',
  cors: {
    origin: '*',
  },
})
export class StorefrontChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  // userId -> socketId
  private users: Record<string, string> = {};

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.users[userId] = client.id;
      console.log(`User connected: ${userId} (${client.id})`);
    } else {
      console.log(`Client connected without userId: ${client.id}`);
    }
  }

  handleDisconnect(client: Socket) {
    for (const [userId, socketId] of Object.entries(this.users)) {
      if (socketId === client.id) {
        delete this.users[userId];
        console.log(`User disconnected: ${userId} (${client.id})`);
        break;
      }
    }
  }

  // Private message handler
  @SubscribeMessage('private-message')
  handlePrivateMessage(
    @MessageBody()
    data: { to: string; from: string; message: string; timestamp?: number },
    @ConnectedSocket() client: Socket,
  ) {
    const toSocketId = this.users[data.to];
    if (toSocketId) {
      this.server.to(toSocketId).emit('private-message', {
        from: data.from,
        message: data.message,
        timestamp: data.timestamp || Date.now(),
      });
    }
  }

  // Optionally, keep the public broadcast for testing
  // @SubscribeMessage('message')
  // handleMessage(@MessageBody() data: { user: string; message: string }, @ConnectedSocket() client: Socket) {
  //   this.server.emit('message', data);
  // }
}
