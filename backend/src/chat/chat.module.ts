import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { SearchModule } from './search/search.module';
import { ChatDmsModule } from './chat-dms/chat-dms.module';
import { ChatRoomsModule } from './chat-rooms/chat-rooms.module';
import { ConversationModule } from './conversation/conversation.module';

@Module({
  imports: [SearchModule, ChatDmsModule, ChatRoomsModule, ConversationModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
