import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { AuthDto } from './dto';
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService, 
        private jwt: JwtService, 
        private config: ConfigService,
    ) {}

    async getTokens(userId: number, email: string): Promise<Tokens> {
        const accessToken = await this.jwt.signAsync({ 
            userId, 
            email 
        }, { 
            secret: this.config.get('JWT_SECRET'), 
            expiresIn: '15m',
        });

        const refreshToken = await this.jwt.signAsync({ 
            userId, 
            email 
        }, { 
            secret: this.config.get('JWT_REFRESH_SECRET'), 
            expiresIn: '7d', 
        });
        
        return { accessToken: accessToken, refreshToken: refreshToken };
    }

    async signup(dto: AuthDto): Promise<Tokens> {
        const hash = await argon.hash(dto.password);

        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                fullName: dto.fullName,
                userName: dto.userName,
                hash,
            }
        })

        const tokens = await this.getTokens(user.id, user.email);
        return tokens;
    }

    signin(dto: AuthDto) {

    }

    async validateUser(profile: any): Promise<any> {

      const user = await this.prisma.user.findUnique({
          where: {
              email: profile.emails[0].value
          }
      });

      if (!user)
        return null;

      return { ...user, new: "false" };
    }

    async createUser(profile: any): Promise<any> {

        const newUser = await this.prisma.user.create({
            data: {
                email: profile.emails[0].value,
                userName: profile.username,
                fullName: profile.displayName,
                hash: 'hey',
                photo: profile._json.image.link,
            }
        })

        if (newUser)
            return { user: newUser, new: "true"};
        else
            throw new Error('Cannot create user');
    }
}
