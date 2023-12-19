import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
    WebSocketServer,
  } from '@nestjs/websockets';
  import { CreateChatRoomDto } from './dto/create-chat-room.dto';
  import { Server, Socket } from 'socket.io';
import { ConversationService } from './conversation.service';
  
  @WebSocketGateway({
    cors: {
      origin: 'http://localhost:3000',
    },
  })
  export class ConversationGateway {
    constructor(private readonly conversationService: ConversationService) {}
  
    @WebSocketServer()
    server: Server;
  
    @SubscribeMessage('createChatRoom')
    async create(@MessageBody() createChatRoomDto: CreateChatRoomDto) {
      const chatRoomMessage =
        await this.conversationService.create(createChatRoomDto);
      this.server.emit('newChatRoom', chatRoomMessage);
      return chatRoomMessage;
    }
  
    @SubscribeMessage('joinChatRoom')
    joinRoom(
      @MessageBody('name') name: string,
      @ConnectedSocket() client: Socket,
    ) {
      return this.conversationService.identify(name, client.id);
    }
  
    @SubscribeMessage('findAllChatRooms')
    findAll() {
      return this.conversationService.findAll();
    }
  
    @SubscribeMessage('Typing')
    async typing(
      @MessageBody('isTyping') isTyping: boolean,
      @ConnectedSocket() client: Socket,
    ) {
      const name = await this.conversationService.getClientName(client.id);
      client.broadcast.emit('typing', { name, isTyping });
    }
  }
  