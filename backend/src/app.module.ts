import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ChatService } from './chat/chat.service';
import { ChatController } from './chat/chat.controller';
import { ChatModule } from './chat/chat.module';


@Module({
  imports: [AuthModule, UserModule, PrismaModule, MulterModule, ChatModule,
    ServeStaticModule.forRoot({
      rootPath: '/Users/elias/Documents/GitHub/ft_transcendence/backend/uploads/',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
  })],
  controllers: [AppController, ChatController],
  providers: [ AppService, ChatService]

})
export class AppModule {}
