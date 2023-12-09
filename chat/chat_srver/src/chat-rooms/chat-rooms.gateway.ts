import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatRoomsService } from './chat-rooms.service';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { Server, Socket } from 'socket.io';
import { userInfo } from 'os';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
  },
})
export class ChatRoomsGateway {
  constructor(private readonly chatRoomsService: ChatRoomsService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('createChatRoom')
  async create(@MessageBody() createChatRoomDto: CreateChatRoomDto) {
    const chatRoomMessage =
      await this.chatRoomsService.create(createChatRoomDto);
    this.server.emit('newChatRoom', chatRoomMessage);
    return chatRoomMessage;
  }

  @SubscribeMessage('joinChatRoom')
  joinRoom(
    @MessageBody('chatRoomId') chatRoomId: number,
    @ConnectedSocket() client: Socket,
  ) {
    return this.chatRoomsService.identify(userInfo.name, client.id);
  }

  @SubscribeMessage('findAllChatRooms')
  findAll() {
    return this.chatRoomsService.findAll();
  }

  @SubscribeMessage('Typing')
  async typing(
    @MessageBody('isTyping') isTyping: boolean,
    @ConnectedSocket() client: Socket,
  ) {
    const name = await this.chatRoomsService.getClientName(client.id);
    client.broadcast.emit('typing', { name, isTyping });
  }
}
