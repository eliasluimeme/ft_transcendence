import { Body, Controller, Get, HttpCode, Post, Req, Request, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IntraAuthGuard } from './guards/intra.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import { Jwt2faAuthGuard } from './guards/jwt-2fa.guard';
import { ConfigService } from '@nestjs/config';
import { LocalAuthGuard } from './guards/local.guard';
import { UserService } from 'src/user/user.service';
import { Response } from 'express';


@Controller()
export class AuthController {
    constructor(
        private authService: AuthService,
        private userService: UserService,
        private configService: ConfigService,
    ) {}

    @Get('auth/42/login')
    @UseGuards(IntraAuthGuard)
    authLogin() {}
    
    @Get('auth/42/callback')
    @UseGuards(IntraAuthGuard)
    async authCallBack(@Req() req, @Res({ passthrough: true }) res): Promise<any> {
        // handle dont authorize 42 auth
        const token = await this.authService.generateToken(req.user, false);
        res.cookie( 'access_token', `${token}`, { httpOnly: true, maxAge: 60 * 60 * 24 * 1000 });

        if (req.user.isTwoFactorAuthEnabled)
            return res.redirect(this.configService.get('FRONTEND_URL') + 'Login/2fa');
        else if (req.user.new)
            return res.redirect(this.configService.get('FRONTEND_URL') + 'settings');
        else
            return res.redirect(this.configService.get('FRONTEND_URL'));
    }

  @Get('auth/2fa/generate')
  @UseGuards(Jwt2faAuthGuard)
  async generate2FAQrCode(@Req() req, @Res() res): Promise<any> {
    const qr = await this.authService.generateQrCode(req.user);
    res.set('Content-Type', 'image/png');
    return res.send({ qr: qr });
  }

    @Post('auth/2fa/login')
    @UseGuards(JwtAuthGuard)
    async auth2FA(@Req() req, @Body() body, @Res({ passthrough: true }) res): Promise<any> {
        const is2FACodeValid = this.authService.is2FACodeValid(
            body.number,
            req.user.twoFactorAuthSecret,
        );

    if (!is2FACodeValid) throw new UnauthorizedException('Invalid 2FA code');

        const token = await this.authService.generateToken(req.user, true);
        res.cookie( 'access_token', `${token}` , {httpOnly: true, maxAge: 60 * 60 * 24 * 1000} );
    }
    
    @Post('auth/2fa/turn-on')
	@UseGuards(Jwt2faAuthGuard)
    async turnOn2FA(@Req() req: any, @Res({ passthrough: true }) res: any, @Body() body: any): Promise<any> {
        const is2FACodeValid = this.authService.is2FACodeValid(
            body.number,
            req.user.twoFactorAuthSecret
        );

    if (!is2FACodeValid) throw new UnauthorizedException('Invalid 2FA code');

        const token = await this.authService.generateToken(req.user, true);
        res.clearCookie('access_token');
        const activated = this.authService.activate2FA(req.user.id);
        res.cookie( 'access_token', `${token}` , { httpOnly: true, maxAge: 60 * 60 * 24 * 1000 });
        res.status(201).json( {on: true} )
    }
    
    @Get('auth/2fa/turn-off')
	@UseGuards(Jwt2faAuthGuard)
    async turnOff2FA(@Req() req, @Res() res): Promise<any> {
        const token = await this.authService.generateToken(req.user, false);
        res.clearCookie('access_token');
        // res.cookie( 'access_token', `${token}` , { httpOnly: true, maxAge: 60 * 60 * 24 * 1000 });
        this.authService.desactivate2FA(req.user.id);
        res.status(200).json({off: true});
    }

    @Get('logout')
    @HttpCode(200)
    @UseGuards(Jwt2faAuthGuard)
    logout(@Res() res: Response) {
        res.clearCookie('access_token');
        return res.status(200).json({});
    }

    // @Post('signup')
    // async signup(@Body() dto: AuthDto, @Res() res) {
    //     const user = await this.authService.signup(dto);
    //     res.header('Authorization', `Bearer ${user.token}`);
    //     //TODO: email confirmation
    //     return res.status(HttpStatus.CREATED).json(user);
    // }
    
    // @Post('signin')
    // @UseGuards(LocalAuthGuard)
    // async signin(@Body() dto: AuthDto, @Res() res) {
    //     const user = await this.authService.signin(dto);
    //     res.header('Authorization', `Bearer ${user.token}`);
    //     return res.status(HttpStatus.OK).json(user);
    // }
}
