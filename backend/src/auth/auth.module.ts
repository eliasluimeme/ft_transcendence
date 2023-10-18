import { Module } from "@nestjs/common";
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from "@nestjs/passport";
import { IntraStrategy } from "./strategies/intra.strategy";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { UserService } from "src/user/user.service";
import { LocalStrategy } from "./strategies/local.strategy";

@Module({
  imports: [ 
    PassportModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    IntraStrategy,
    JwtStrategy,
    LocalStrategy,
  ],
})
export class AuthModule {}