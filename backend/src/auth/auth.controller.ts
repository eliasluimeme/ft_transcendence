import { Body, Controller, Get, HttpStatus, Post, Req, Request, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IntraAuthGuard } from './guards/intra.guard';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthDto } from './dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LocalAuthGuard } from './guards/local.guard';


@Controller()
export class AuthController {
    constructor(
        private authService: AuthService, 
        private jwtService: JwtService,
        private config: ConfigService) {}

    @Get('auth/login/42')
    @ApiOperation({ summary: '42 Auth' })
    @ApiResponse({ status: 200, description: 'Successfuly authenticated' })
    @UseGuards(IntraAuthGuard)
    authLogin() {}
    
    @Get('auth/login/callback')
    @UseGuards(IntraAuthGuard)
    async authCallBack(@Req() req, @Res({ passthrough: true }) res) {
        const token = await this.authService.getToken( req.user.id, req.user.email );
        res.header('Authorization', `Bearer ${token}`);
        // return res.redirect('/home');
        return { success: true, user: req.user, token: token };
    }

    @Post('signup')
    async signup(@Body() dto: AuthDto, @Res() res) {
        const user = await this.authService.signup(dto);
        res.header('Authorization', `Bearer ${user.token}`);
        //TODO: email confirmation
        return res.status(HttpStatus.CREATED).json(user);
    }
    
    @Post('signin')
    @UseGuards(LocalAuthGuard)
    async signin(@Body() dto: AuthDto, @Res() res) {
        const user = await this.authService.signin(dto);
        res.header('Authorization', `Bearer ${user.token}`);
        return res.status(HttpStatus.OK).json(user);
    }

    @Get('logout')
	@UseGuards(JwtAuthGuard)
	getLogoutPage(@Res({ passthrough: true }) res) {
		res.clearCookie('Authorization');
		return res.redirect('/');
	}

    @Get('home')
    @UseGuards(JwtAuthGuard)
    getHello (@Request() req) {
        return "Hello world!!!";
    }
}
