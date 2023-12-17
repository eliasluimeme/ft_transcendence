import {
  WebSocketGateway,
  // SubscribeMessage,
  // MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatDmsService } from './chat-dms.service';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatDmsGateway {
  constructor(private readonly chatDmsService: ChatDmsService) {}

  @WebSocketServer()
  server: Server;

  // @SubscribeMessage('createChatDm')
  // async handelChatDm(@MessageBody() data: any) {
  //   const message = await this.chatDmsService.handelChatDm(data); // TODO check id
  //   this.server.emit('message', message);
  //   return this.chatDmsService.handelChatDm(data);
  // }

  // @SubscribeMessage('findAllChatDms')
  // findAll() {
  //   return this.chatDmsService.findAll();
  // }

  // @SubscribeMessage('typing')
  // async typing(@MessageBody() id: number) {
  //   return this.chatDmsService.typing(id);
  // }
}
