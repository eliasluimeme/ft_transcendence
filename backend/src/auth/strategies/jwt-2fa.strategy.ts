import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { Request } from 'express';

@Injectable()
export class Jwt2faStrategy extends PassportStrategy(Strategy, 'jwt-2fa') {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
    ) {
    super({
      jwtFromRequest: (req: Request) => {
        let token = null;
        if (req && req.cookies) {
          token = req.cookies.access_token;
        }
        return token;
      },
      secretOrKey: configService.get('JWT_SECRET'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findUserByIntraId(payload.userId);
    
    if (!user) throw new UnauthorizedException('User not found');
  
    // const { twoFactorAuthSecret, ...userWithoutSecret } = user
    if (!user.isTwoFactorAuthEnabled || payload.isTwoFactorAuthenticated)
      return user;
  }
}
