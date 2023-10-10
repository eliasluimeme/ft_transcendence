import { Module } from "@nestjs/common";
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from "@nestjs/passport";
import { IntraStrategy } from "./strategy/intra.strategy";

@Module({
  imports: [ 
    PassportModule.register({ defaultStrategy: '42' }),
  ],
  controllers: [AuthController],
  providers: [AuthService, IntraStrategy]
})
export class AuthModule {}