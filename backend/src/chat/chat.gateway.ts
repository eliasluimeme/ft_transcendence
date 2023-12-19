import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayDisconnect,
  OnGatewayConnection,
  ConnectedSocket,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { CreateChatDmDto } from './dto/create-chat-dm.dto';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect{
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log("heheh")
    if (!client.handshake.headers.cookie)
        client.disconnect();
    client.join('1234');
    // Handle connection event
  }

  handleDisconnect(client: Socket) {
    console.log('disconnected');
    // Handle disconnection event
  }

  @SubscribeMessage('createChat')
  async create(@MessageBody() createChatDmDto: any, @ConnectedSocket() client: Socket) {
    // const message = await this.chatService.create(createChatDmDto, id); // TODO check id
    this.server.to("1234").emit('message', createChatDmDto);
    // return this.chatService.create(createChatDmDto, id);
  }


}
