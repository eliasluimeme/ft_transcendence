import { ForbiddenException, Injectable, Res, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { AuthDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService, 
        private userService: UserService,
        private jwt: JwtService, 
        private config: ConfigService,
    ) {}

    async getToken(userId: number, email: string ) {
        const accessToken = await this.jwt.signAsync({ 
            userId, 
            email 
        }, { 
            secret: this.config.get('JWT_SECRET'), 
            expiresIn: '15m',
        });
        
        return accessToken;
    }

    async signup(dto: AuthDto) {
        try {
            dto.password = await argon.hash(dto.password);
            
            const newUser = await this.userService.createLocalUser(dto);

            delete newUser.hash;

            const token = await this.getToken( newUser.id, newUser.email )

            return { success: true, user: newUser, token: token };
        } catch(error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002')
                    throw new UnauthorizedException("Email or username is already taken");
            }
            throw error;
        }
    }

    async signin(dto: AuthDto) {
        const user = await this.userService.findUserByEmail(dto.email);

        if (!user)
            throw new UnauthorizedException("Invalid credentials");
        
        const pwMatch = await argon.verify(user.hash, dto.password);
        if (!pwMatch)
            throw new UnauthorizedException("Invalid credentials");
    
        delete user.hash;

        const token = await this.getToken(user.id, user.email);
        return { success: true, user: user, token: token };
    }

    async validateIntraUser(profile: any): Promise<any> {
        const user = await this.userService.findUserByEmail(profile.emails[0].value);
        if (user)
            return user;

        const newUser = await this.userService.createIntraUser(profile);
        if (newUser)
            return newUser;
        
        throw new Error('Cannot create user');
    }

    async validateLocalUser(email: string, password: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: email
            }
        });

        if (!user)
            return null;

        const pwMatch = await argon.verify(user.hash, password);
        if (!pwMatch)
            return null;

        return user;
    }
}
