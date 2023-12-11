import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { HttpExceptionFilter, PrismaExceptionFilter } from './exception.filter';
import { APP_FILTER } from '@nestjs/core';


@Module({
  imports: [AuthModule, UserModule, PrismaModule, MulterModule,
    ServeStaticModule.forRoot({
      rootPath: '/Users/elias/Documents/GitHub/ft_transcendence/backend/uploads/',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
  })],
  controllers: [AppController],
  providers: [ AppService,
    // {
    //   provide: APP_FILTER,
    //   useClass: HttpExceptionFilter,
    // },
    // {
    //   provide: APP_FILTER,
    //   useClass: PrismaExceptionFilter,
    // }
  ]

})
export class AppModule {}
