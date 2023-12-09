import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { ChatRoomsService } from './chat-rooms.service';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { Socket } from 'socket.io';
import { userInfo } from 'os';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
  },
})
export class ChatRoomsGateway {
  constructor(private readonly chatRoomsService: ChatRoomsService) {}
  clientToUser = new Map<string, string>();

  @SubscribeMessage('createChatRoom')
  async create(@MessageBody() createChatRoomDto: CreateChatRoomDto) {
    const chatRoomMessage =
      await this.chatRoomsService.create(createChatRoomDto);
    this.chatRoomsService.emit('chatRoomCreated', chatRoomMessage);
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
  typing(@MessageBody() message: string) {
    return this.chatRoomsService.typing(message);
  }
}
