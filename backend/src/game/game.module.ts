import { Logger, Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    GameGateway,
    GameService,
    UserService,
    ConfigService,
    Map,
    Object,
    Logger
  ],
})
export class GameModule {}