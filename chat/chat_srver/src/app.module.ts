import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SearchModule } from './search/search.module';
import { MessagesModule } from './messages/messages.module';
import { MessagesGateway } from './messages/messages.gateway';

@Module({
  imports: [SearchModule, MessagesModule],
  controllers: [AppController],
  providers: [AppService, MessagesGateway],
})
export class AppModule {}
