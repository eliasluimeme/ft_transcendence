import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { ChatDmsService } from './chat-dms.service';
import { CreateChatDmDto } from './dto/create-chat-dm.dto';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
  },
})
export class ChatDmsGateway {
  constructor(private readonly chatDmsService: ChatDmsService) {}

  @SubscribeMessage('createChatDm')
  create(@MessageBody() createChatDmDto: CreateChatDmDto) {
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
