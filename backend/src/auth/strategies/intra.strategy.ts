import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Strategy } from 'passport-42';
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "../auth.service";


@Injectable()
export class IntraStrategy extends PassportStrategy(Strategy, '42') {
    constructor(
      private authService: AuthService,
      private config: ConfigService) {
        super({
            clientID: config.get('UID'),
            clientSecret: config.get('SECRET'),
            callbackURL: config.get('CALLBACKURL'),
            scope: 'public',
        });
    }

    async validate( _accessToken: string, _refreshToken: string, profile: any, done: (error: any, user?: any, info?: any) => void ): Promise<void> {
        try {
          // console.log(profile);
          const user = await this.authService.validateIntraUser(profile);

          // return user;
          done(null, user);
        } catch (error) {
          // return error;
          done(error, false);
        }
      }
}