import { Body, Controller, Get, HttpCode, Post, Req, Request, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IntraAuthGuard } from './guards/intra.guard';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt.guard';
import { Jwt2faAuthGuard } from './guards/jwt-2fa.guard';
import { ConfigService } from '@nestjs/config';
import { LocalAuthGuard } from './guards/local.guard';


@Controller()
export class AuthController {
    constructor(
        private authService: AuthService,
        private configService: ConfigService,
    ) {}

    @Get('auth/42/login')
    @UseGuards(IntraAuthGuard)
    authLogin() {}
    
    @Get('auth/42/callback')
    @UseGuards(IntraAuthGuard)
    async authCallBack(@Req() req, @Res({ passthrough: true }) res) {
        // if (req.user.isTwoFactorAuthEnabled)
        //     return res.redirect('auth/2fa');

        const token = await this.authService.login(req.user, false);
        res.cookie( 'access_token', `${token}` , {httpOnly: true, maxAge: 60 * 60 * 24 * 1000});
        return res.redirect(this.configService.get('FRONTEND_URL'));
    }

    @Get('auth/2fa/generate')
    @UseGuards(JwtAuthGuard)
    async generate2FAQrCode(@Req() req) {
        return await this.authService.generateQrCode(req.user);
    }

    @Post('auth/2fa/login')
    @HttpCode(200)
    // @UseGuards(JwtAuthGuard)
    async auth2FA(@Req() req, @Body() body, @Res({ passthrough: true }) res) {
        const is2FACodeValid = this.authService.is2FACodeValid(
            body.twoFactorAuthenticationCode,
            req.user.twoFactorAuthSecret
        );

        if (!is2FACodeValid)
            throw new UnauthorizedException('Invalid 2FA code');

        const token = await this.authService.login(req.user, true);
        return res.cookie( token , {httpOnly: true, maxAge: 60 * 60 * 24 * 1000});
    }
    
    @Post('auth/2fa/turn-on')
	@UseGuards(JwtAuthGuard)
    async turnOn2FA(@Req() req, @Body() body) {
        const is2FACodeValid = this.authService.is2FACodeValid(
            body.twoFactorAuthenticationCode,
            req.user.twoFactorAuthSecret
        );

        if (!is2FACodeValid)
            throw new UnauthorizedException('Invalid 2FA code');

        return await this.authService.activate2FA(req.user.id);
    }
    
    @Post('auth/2fa/turn-off')
	@UseGuards(JwtAuthGuard)
    async turnOff2FA(@Req() req, @Body() body) {
        return await this.authService.desactivate2FA(req.user.id);
    }

    @Get('logout')
    @UseGuards(JwtAuthGuard)
    getLogoutPage(@Res({ passthrough: true }) res) {
        res.clearCookie('access_token');
        return res.redirect(this.configService.get('FRONTEND_URL') + 'Login');
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

    @Get('home')
    @UseGuards(Jwt2faAuthGuard)
    getHello (@Request() req) {
        return "Hello world!!!";
    }
}
