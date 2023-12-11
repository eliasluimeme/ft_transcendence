import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatDmsService } from './chat-dms.service';
import { CreateChatDmDto } from './dto/create-chat-dm.dto';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
  },
})
export class ChatDmsGateway {
  constructor(private readonly chatDmsService: ChatDmsService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('createChatDm')
  async create(@MessageBody() createChatDmDto: CreateChatDmDto) {
    const message = await this.chatDmsService.create(createChatDmDto);
    this.server.emit('message', message);
    return this.chatDmsService.create(createChatDmDto);
  }

  @SubscribeMessage('findAllChatDms')
  findAll() {
    return this.chatDmsService.findAll();
  }

  @SubscribeMessage('typing')
  async typing(@MessageBody() id: number) {
    return this.chatDmsService.typing(id);
  }
}
