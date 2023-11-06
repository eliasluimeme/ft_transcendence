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

    getToken( payload: any ) {
        const accessToken = this.jwt.sign({ 
            payload,
        }, { 
            secret: this.config.get('JWT_SECRET'), 
            expiresIn: '1d',
        });
        
        return accessToken;
    }

    async login( user: any, isAuthenticated: boolean ) {
        const payload = {
            userId: user.id,
            email: user.email,
            isTwoFactorAuthEnabled: !!user.isTwoFactorAuthEnabled,
            isTwoFactorAuthenticated: isAuthenticated,
        }

        return this.getToken(payload);
    }

    async generate2FASecret(user: any) {
        const secret = authenticator.generateSecret();

        const otpauthUrl = authenticator.keyuri(user.email, 'TRENDENDEN', secret);

        await this.set2FASecret(user.id, secret);

        return { secret, otpauthUrl };
    }

    async generateQrCode( user: any ) {
        const otp = await this.generate2FASecret(user);
        return toDataURL(otp.otpauthUrl);
    }

    async set2FASecret(userId: number, secret: string) {
        try {
            await this.userService.updateUser(userId, { twoFactorAuthSecret: secret });
            // const user = await this.prisma.user.update({
            //     where: {
            //         id: userId,
            //     },
            //     data: {
            //         twoFactorAuthSecret: secret,
            //     }
            // });
        } catch (error) {
            console.error('Error setting 2FA secret: ', error);
        }
    }

    async activate2FA(userId: number) {
        try {
            await this.userService.updateUser(userId, { isTwoFactorAuthEnabled: true, });
        //     const user = await this.prisma.user.update({
        //         where: {
        //             id: userId,
        //         },
        //         data: {
        //             isTwoFactorAuthEnabled: true,
        //         }
        //     });
        console.log(await this.userService.findUserById(userId));
        } catch (error) {
            console.error('Error enabling 2FA: ', error);
        }
    }

    async desactivate2FA(userId: number) {
        try {
            await this.userService.updateUser(userId, { isTwoFactorAuthEnabled: false });
            // const user = await this.prisma.user.update({
            //     where: {
            //         id: userId,
            //     },
            //     data: {
            //         isTwoFactorAuthEnabled: false,
            //     }
            // });
        } catch (error) {
            console.error('Error disabling 2FA: ', error);
        }
    }

    is2FACodeValid(code: string, secret: string): boolean {
        return authenticator.verify({ token: code, secret });
    }

    // async login2FA(user: any) {
    //     const payload = {
    //         userId: user.id,
    //         email: user.email,
    //         isTwoFactorAuthEnabled: !!user.isTwoFactorAuthEnabled,
    //         isTwoFactorAuthenticated: true,
    //     };

    //     return this.getToken(payload);
    // }

    async updateProfile(userId: number, data: any) {
        return await this.userService.updateUser(userId, data);
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

    async validateIntraUser(profile: any): Promise<any> {
        let user = await this.userService.findUserByEmail(profile.emails[0].value);

        if (!user)
            user = await this.userService.createIntraUser(profile);

        if (user)
            return user;
        
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
