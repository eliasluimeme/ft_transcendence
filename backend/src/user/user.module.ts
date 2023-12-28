import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ChatService } from 'src/chat/chat.service';


@Module({
  controllers: [UserController],
  providers: [UserService, ChatService],
})
export class UserModule {}
