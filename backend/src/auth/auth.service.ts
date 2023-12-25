import { ForbiddenException, Injectable, Res, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { AuthDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService, 
        private userService: UserService,
        private jwt: JwtService, 
        private config: ConfigService,
    ) {}

    private blacklistToken: string[] = [];

    async getToken( payload: any ): Promise<any> {
        const accessToken = this.jwt.sign({ 
            payload,
        }, { 
            secret: this.config.get('JWT_SECRET'), 
            expiresIn: '1d',
        });
        
        return accessToken;
    }

    async generateToken( user: any, is2FAAuthenticated: boolean ): Promise<any> {
        return await this.jwt.signAsync({ 
            userId: user.intraId,
            email: user.email,
            isTwoFactorAuthEnabled: !!user.isTwoFactorAuthEnabled,
            isTwoFactorAuthenticated: is2FAAuthenticated,
          }, { 
            secret: this.config.get('JWT_SECRET'), 
            expiresIn: '1d',
        });
    }

    async set2FASecret(userId: number, secret: string): Promise<any> {
        try {
            await this.userService.updateUser(userId, { twoFactorAuthSecret: secret });
        } catch (error) {
            console.error('Error setting 2FA secret: ', error);
        }
    }

    async generate2FASecret(user: any): Promise<any> {
        let secret: any;

        if (!user.twoFactorAuthSecret) {
           secret = authenticator.generateSecret();
           await this.set2FASecret(user.id, secret);
        } else secret = user.twoFactorAuthSecret;

        const otpauthUrl = authenticator.keyuri(user.email, 'TRENDENDEN', secret);

        return { secret, otpauthUrl };
    }

    async generateQrCode( user: any ): Promise<any> {
        const otp = await this.generate2FASecret(user);
        return await toDataURL(otp.otpauthUrl);
    }

    async activate2FA(userId: number): Promise<any> {
        try {
            const update = this.userService.updateUser(userId, { isTwoFactorAuthEnabled: true });
            if (update)
                return { success: true }
        } catch (error) {
            console.error('Error enabling 2FA: ', error);
        }
    }

    async desactivate2FA(userId: number): Promise<any> {
        try {
            const update = this.userService.updateUser(userId, { isTwoFactorAuthEnabled: false });
            if (update)
                return { success: true }
        } catch (error) {
            console.error('Error disabling 2FA: ', error);
        }
    }

    is2FACodeValid(code: string, secret: string): boolean {
        return authenticator.verify({ token: code, secret: secret });
    }

    async updateProfile(userId: number, data: any) {
        return await this.userService.updateUser(userId, data);
    }

    
    async validateIntraUser(profile: any): Promise<any> {
        try {
            const user = await this.userService.findUserByIntraId(profile.id);
    
            if (!user) {
                const newUser = await this.userService.createIntraUser(profile);
                const user = { ...newUser, new: true };
                return user;
            }

            const newUser = { ...user, new: false}
      return newUser;
    } catch (err) {
      throw err;
    }
  }

  async validateLocalUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) return null;

    const pwMatch = await argon.verify(user.hash, password);
    if (!pwMatch) return null;

        return user;
    }

    async logout(token: string) {
        this.blacklistToken.push(token);
    }

// async signup(dto: AuthDto) {
//     try {
//         dto.password = await argon.hash(dto.password);
        
//         const user = await this.userService.createLocalUser(dto);

//         const {hash: _, ...newUser} = user;

//         const token = await this.getToken( newUser.id, newUser.email )

//         return { user: newUser, token: token };
//     } catch(error) {
//         if (error instanceof PrismaClientKnownRequestError) {
//             if (error.code === 'P2002')
//                 throw new UnauthorizedException("Email or username is already taken");
//         }
//         throw error;
//     }
// }

// async signin(dto: AuthDto) {
//     const user = await this.userService.findUserByEmail(dto.email);

//     if (!user)
//         throw new UnauthorizedException("Invalid credentials");
    
//     const pwMatch = await argon.verify(user.hash, dto.password);
//     if (!pwMatch)
//         throw new UnauthorizedException("Invalid credentials");

//     delete user.hash;

//     const token = await this.getToken(user.id, user.email);
//     return { success: true, user: user, token: token };
// }
}
