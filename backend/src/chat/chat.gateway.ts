import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { AuthService } from 'src/auth/auth.service';
// import { userIdDTO } from 'src/user/dto/userId.dto';
import { UserService } from 'src/user/user.service';
import { UnauthorizedException } from '@nestjs/common';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayDisconnect,
  OnGatewayConnection,
} from '@nestjs/websockets';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
  },
  namespace: 'chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly chatService: ChatService,
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @WebSocketServer()
  server: Server;

  userToClient = new Map<number, string>();

  async handleConnection(client: Socket) {
    // Handle connection event
    try {
      // const decodedToken = await this.authService.verifyJwt(
      //   client.handshake.headers.cookie,
      // ); //  TODO : Endpoint to verify JWT
      // const user: userIdDTO = await this.userService.getOne(
      //   decodedToken.user.id,
      // ); // TODO endpoint to get user
      const user = { id: 1 };
      if (!user) {
        return this.disconnect(client);
      } else {
        //////////////////////
        this.userToClient.set(user.id, client.id);
      }
      console.log(client.id, 'successfully connected ');
      // if (!client.handshake.headers.cookie) client.disconnect();
    } catch {
      return this.disconnect(client);
    }
  }

  handleDisconnect(client: Socket) {
    // Handle disconnection event
    delete this.userToClient[client.id];
    this.disconnect(client);
    console.log('disconnected', client.id);
  }

  private disconnect(client: Socket) {
    client.emit('error', new UnauthorizedException());
    client.disconnect();
  }

  @SubscribeMessage('conversation')
  async handelConversation(@MessageBody() data: any) {
    console.log('data is ++++++++++++++=');
    const { senderId, reciverId, messageContent, type } = data;
    console.log('data is ', data);
    if (type === 'DM') {
      console.log('data is ', senderId);
      this.server
        .to(this.userToClient[senderId])
        .emit('received', messageContent);
      this.server
        .to(this.userToClient[reciverId])
        .emit('received', messageContent);
      console.log('data is ', data);
    } else if (type === 'GROUP') {
      this.server.emit('received', messageContent);
    }
  }
}
