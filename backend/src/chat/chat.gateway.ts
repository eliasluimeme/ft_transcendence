import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { AuthService } from 'src/auth/auth.service';
import { userIdDTO } from 'src/user/dto/userId.dto';
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
    if (accessToken)
      return accessToken;
    return null;
  }

  async handleConnection(client: Socket) {
    // Handle connection event
    try {
      const token = this.extractTokenFromCookies(client.handshake.headers.cookie);
      if (!token)
        return this.disconnect(client);

      const verifiedToken = await this.jwtService.verifyAsync(
        token,
        { secret: process.env.JWT_SECRET },
      );
      if (!verifiedToken)
        return this.disconnect(client);

      const user = await this.userService.findUserByIntraId(verifiedToken.userId)
      if (!user)
        return this.disconnect(client);

      this.userToClient.set(user.id, client.id);
      console.log(client.id, 'successfully connected ');
    } catch (error) {
      console.log("erroooor: ", error);
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
    console.log('data is ', data);
    if (type === 'DM') {
      this.server
        .to(this.userToClient[senderId])
        .emit('conversation', messageContent);
      this.server
        .to(this.userToClient[reciverId])
        .emit('conversation', messageContent);
      console.log('data is ', data);
    } else if (type === 'GROUP') {
      this.server.emit('conversation', messageContent);
    }
  }
}