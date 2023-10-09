import { Module } from "@nestjs/common";
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from "@nestjs/passport";
import { IntraStrategy } from "./strategies/intra.strategy";
import { AtStrategy } from "./strategies/at.strategy";
import { RtStrategy } from "./strategies/rt.strategy";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [ 
    PassportModule.register({ defaultStrategy: '42' }),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    IntraStrategy, 
    AtStrategy, 
    RtStrategy
  ],
})
export class AuthModule {}