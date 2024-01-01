import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayDisconnect,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { idMessageDto } from './dto/id.dto';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
  namespace: 'chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private chatService: ChatService,
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  @WebSocketServer()
  server: Server;
    socket: Socket;

  userToClient = new Map<number, string>();

  extractTokenFromCookies(cookies: any): string | null {
    const accessToken = cookies?.split('=')[1].replace(/"/g, '');
    if (accessToken)
      return accessToken;
    return null;
  }

  async findUserByIntraId(userId: string) {
    try {
        const user = await this.prisma.user.findUnique({
            where: {
                intraId: userId,
            },
            include: {
                level: true,
            }
        });
        if (user) {
            delete user.hash;
            return user;
        } else return user;
    } catch (error) {
    }
}

async join_chat_rooms(socket: Socket, user_id: number) {
    const all_user_rooms = await this.chatService.getAllUserRooms(user_id)
    all_user_rooms.forEach((room) => {
      socket.join(room.chatroom.id + "_room")
    });
    // console.log("All Rooms joined ",socket.rooms)
  }

async handleConnection(client: Socket) {
    try {
      const token = this.extractTokenFromCookies(client.handshake.headers.cookie);
      if (!token) return this.disconnect(client);
      
      const verifiedToken = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      if (!verifiedToken) return this.disconnect(client);
      
      const user = await this.findUserByIntraId(verifiedToken.userId)
    if (!user)
      return this.disconnect(client);

    this.userToClient.set(user.id, client.id);
    client.data.user = verifiedToken
    await this.join_chat_rooms(client, user.id)
    } catch (error) {
        // console.log('erroooor: ', error);
      return this.disconnect(client);
    }
  }

  handleDisconnect(client: Socket) {
    delete this.userToClient[client.id];
    this.disconnect(client);
  }

  private disconnect(client: Socket) {
    client.emit('error', new UnauthorizedException());
    client.disconnect();
  }

  @SubscribeMessage('conversation')
  async handelConversation(socket: Socket, @MessageBody() data: any) {
    const newId : number = parseInt(data.roomId); 
    const room  = await this.chatService.getExistenceRoom(newId);
    if (!room)
      this.server.emit('error', "chat room does not exist");
    const roomUser = await this.chatService.get_room_user(newId, data.senderId)
    // if (roomUser.isBlocked){
    //   this.server.emit("Error", "You have been blocked")
    //   return ;
    // }
    if (roomUser.isMuted){
      this.server.emit("Error", "You have been muted")
      return ;
    } 
    if (roomUser.isBanned){
      this.server.emit("Error", "You have  been banned")
      return ;
    } 
    const pyload : idMessageDto = {
      userId : data.senderId,
      content : data.messageContent,
      createdAt : new Date(),
      roomId: data.roomId,
    }
      this.server.to(data.roomId  + "_room").emit('reciecved', pyload);
      await this.chatService.addMessage(data.senderId, newId, data.messageContent);
  }

  // @SubscribeMessage('notifications')
  // async notifications(@MessageBody() data: any) {
  //   const { senderId, reciverId, content } = data;
  //   this.server.to(this.userToClient[reciverId]).emit('notifications', content);
  // }

}
