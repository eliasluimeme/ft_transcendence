import { Module } from '@nestjs/common';
import { ChatRoomsService } from './chat-rooms.service';
import { ChatRoomsGateway } from './chat-rooms.gateway';

@Module({
  providers: [ChatRoomsGateway, ChatRoomsService],
})
export class ChatRoomsModule {}
