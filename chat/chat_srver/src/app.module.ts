import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SearchModule } from './search/search.module';
import { MessagesModule } from './messages/messages.module';
import { MessagesGateway } from './messages/messages.gateway';
import { ChatDmsModule } from './chat-dms/chat-dms.module';
import { ChatRoomsModule } from './chat-rooms/chat-rooms.module';

@Module({
  imports: [SearchModule, MessagesModule, ChatDmsModule, ChatRoomsModule],
  controllers: [AppController],
  providers: [AppService, MessagesGateway],
})
export class AppModule {}
