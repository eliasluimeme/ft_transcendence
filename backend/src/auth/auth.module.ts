import { Module } from "@nestjs/common";
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from "@nestjs/passport";
import { IntraStrategy } from "./strategies/intra.strategy";
import { JwtModule } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";
import { LocalStrategy } from "./strategies/local.strategy";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { Jwt2faStrategy } from "./strategies/jwt-2fa.strategy";

@Module({
  imports: [ 
    PassportModule,
    JwtModule.register({
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    IntraStrategy,
    Jwt2faStrategy,
    JwtStrategy,
    LocalStrategy,
  ],
})
export class AuthModule {}