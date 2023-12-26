import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class GameGuard implements CanActivate {
  constructor() {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    var config: ConfigService = new ConfigService;
    if (context.getType() !== 'ws') return false;
    const client: Socket = context.switchToWs().getClient();
    const secret = config.get('JWT_SECRET');
    return (GameGuard.validateToken(client, secret));
  }

  static validateToken(client: Socket, secret:string): boolean | Promise<boolean> | Observable<boolean>
  {
    try {
    var logger: Logger = new Logger(GameGuard.name);
    //logger.log("Checking JWT Signature...");
    const cookieHeader = client.handshake.headers.cookie;
    const cookies = require('cookie').parse(cookieHeader);
    const token = cookies['access_token'];
    if (!token) return false;
      const data = jwt.verify(token, secret);
      client.data = (data as jwt.JwtPayload).userId;
      return true;
    }
    catch (error) {
      logger.error("[Access Denied]: JWT Signature is not valid.");
      return false;
    }
  }
}
