import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { SearchModule } from './search/search.module';
import { ChatDmsModule } from './chat-dms/chat-dms.module';
import { ChatRoomsModule } from './chat-rooms/chat-rooms.module';
import { ConversationModule } from './conversation/conversation.module';
import { ChatGateway } from './chat.gateway';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    SearchModule,
    ChatDmsModule,
    ChatRoomsModule,
    ConversationModule,
    AuthModule,
    UserModule,
    JwtModule,
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway, AuthService, UserService],
})
export class ChatModule {}