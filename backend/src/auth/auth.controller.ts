import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IntraGuard } from './guards/intra.guard';
import { Response } from 'express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthDto } from './dto';
import { Tokens } from './types';


@Controller()
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signup') 
    signup(@Body() dto: AuthDto): Promise<Tokens> {
        return this.authService.signup(dto);
    }

    @Post('signin')
    signin(@Body() dto: AuthDto) {
        return this.authService.signin(dto);
    }

    @Get('login/auth/42')
    @ApiOperation({ summary: '42 Auth' })
    @ApiResponse({ status: 200, description: 'Successfuly authenticated' })
    @UseGuards(IntraGuard)
    authLogin() {}

    @Get('login/auth/callback')
    @UseGuards(IntraGuard)
    authCallBack(@Req() req, @Res() res: Response) {
        console.log(req.user);
        res.redirect('/');
    }

    @Get('logout')
	// @UseGuards(JwtGuard)
	getLogoutPage(@Res({ passthrough: true }) res: Response) {
		res.clearCookie('jwt_token');
		return res.redirect('/auth/login');
	}

    @Post('refresh')
    refreshTokens() {

    }
}
