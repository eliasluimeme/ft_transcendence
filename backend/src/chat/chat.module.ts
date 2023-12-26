import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { SearchModule } from './search/search.module';
// import { ConversationModule } from './conversation/conversation.module';
import { ChatGateway } from './chat.gateway';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { SchedulerService } from './scheduler.service';

@Module({
  imports: [
    SearchModule,
    // ConversationModule,
    AuthModule,
    UserModule,
    JwtModule,
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway, AuthService, UserService, SchedulerService],
})
export class ChatModule {}