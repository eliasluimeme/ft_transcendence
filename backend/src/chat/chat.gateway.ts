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
        console.error('Error finding user: ', error);
    }
}

async join_chat_rooms(socket: Socket, user_id: number) {
    const all_user_rooms = await this.chatService.getAllUserRooms(user_id)
    all_user_rooms.array.forEach((room) => {
      socket.join(room.id)
    });
  }

async handleConnection(client: Socket) {
    // Handle connection event
  // console.log('connected', client.id);
  try {
      console.log("tokeeen :", client.handshake.headers)
      const token = this.extractTokenFromCookies(client.handshake.headers.cookie);
      if (!token) return this.disconnect(client);
      
      const verifiedToken = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      if (!verifiedToken) return this.disconnect(client);
      
      const user = await this.findUserByIntraId(verifiedToken.userId)
      
    //   console.log('user    ', user )
    if (!user)
      return this.disconnect(client);

    this.userToClient.set(user.id, client.id);
    console.log(client.id, 'successfully connected ');
    client.data.user = verifiedToken
    // const user_id = client.data.user.userId
    await this.join_chat_rooms(client, user.id)
    } catch (error) {
        console.log('erroooor: ', error);
      return this.disconnect(client);
    }
  }

  handleDisconnect(client: Socket) {
    delete this.userToClient[client.id];
    this.disconnect(client);
    console.log('disconnected', client.id);
  }

  private disconnect(client: Socket) {
    client.emit('error', new UnauthorizedException());
    client.disconnect();
  }

  @SubscribeMessage('conversation')
  async handelConversation(socket : Socket , @MessageBody() data: idMessageDto) {
    // console.log('heeloooooooo ' ,data);
    const idRoom : string = data.roomId.toString();
    const roomId : number = data.roomId;
    const room  = await this.chatService.getExistenceRoom(roomId); // for checking if room exists
    if (!room)
      socket.emit('error', "chat room does not exist");
    const roomUser = await this.chatService.get_room_user(roomId, data.senderId) // for checking if user is banned && muted && blocked
    if (roomUser.isBlocked){
      socket.emit("Error", "You have been blocked")
      return ;
    }
    if (roomUser.isMuted){
      socket.emit("Error", "You have been muted")
      return ;
    } 
    if (roomUser.isBanned){
      socket.emit("Error", "You have been banned")
      return ;
    } 

    console.log("room id inside conversation === ", typeof(idRoom))
    const pyload : idMessageDto = {
      roomId: data.roomId,
      content : data.content,
      senderId : data.senderId,
      timestamp: new Date(),
    }

    socket.to(idRoom).emit('message', pyload);
    
    await this.chatService.addMessage(pyload.senderId, roomId, data.content);
  }

  // @SubscribeMessage('notifications')
  // async notifications(@MessageBody() data: any) {
  //   const { senderId, reciverId, content } = data;
  //   this.server.to(this.userToClient[reciverId]).emit('notifications', content);
  // }

}
