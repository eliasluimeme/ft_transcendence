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
// import { MESSAGES } from '@nestjs/core/constants';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly chatService: ChatService,
    private authService: AuthService,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  @WebSocketServer()
  server: Server;

  userToClient = new Map<number, string>();

  private extractTokenFromCookies(cookies: any): string | null {
    const accessToken = cookies.split('=')[1].replace(/"/g, '');
    if (accessToken) return accessToken;
    return null;
  }

  async handleConnection(client: Socket) {
    // Handle connection event
    try {
      const token = this.extractTokenFromCookies(
        client.handshake.headers.cookie,
      );
      if (!token) return this.disconnect(client);

      const verifiedToken = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      if (!verifiedToken) return this.disconnect(client);

      const user = await this.userService.findUserByIntraId(
        verifiedToken.userId,
      );
      if (!user) return this.disconnect(client);

      this.userToClient.set(user.id, client.id);
      console.log(client.id, 'successfully connected ');
    } catch (error) {
      console.log('erroooor: ', error);
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
    const { senderId, reciverId, messageContent, type } = data;
    // console.log('data is ', data);
    console.log('Here i am');
    if (type === 'DM') {
      // this.server.on('conversation', (messageContent) => {
      // console.log('data is ', reciverId);
      // console.log('data is ', senderId);
      this.server
        .to(this.userToClient[senderId])
        .emit('conversation', messageContent);
      this.server
        .to(this.userToClient[reciverId])
        .emit('recieve', messageContent);
      // });
      // this.server.emit('received', messageContent);
    } else if (type === 'GROUP') {
      this.server.emit('conversation', messageContent);
    }
  }
}

// {
//   "visibility": "DM",
//   "users": [
//       {
//           "id": 2,
//           "name": "yjaadoun",
//           "photo": "https://cdn.intra.42.fr/users/84a3983c8aff058948b6b7a6f613584b/yjaadoun.jpg",
//           "self": true
//       },
//       {
//           "id": 4,
//           "name": "ael-hajj",
//           "photo": "https://cdn.intra.42.fr/users/ae7ac95c539d98e693cb8dc7c15327b3/ael-hajj.jpg",
//           "self": false
//       }
//   ]
// }