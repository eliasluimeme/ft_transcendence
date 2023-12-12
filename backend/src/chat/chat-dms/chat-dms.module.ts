import { Module } from '@nestjs/common';
import { ChatDmsService } from './chat-dms.service';
import { ChatDmsGateway } from './chat-dms.gateway';

@Module({
  providers: [ChatDmsGateway, ChatDmsService],
})
export class ChatDmsModule {}
