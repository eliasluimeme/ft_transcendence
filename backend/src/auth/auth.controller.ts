import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IntraGuard } from './guards/intra.guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Get('42')
    @UseGuards(IntraGuard)
    Login() {}

    @Get('callback')
    @UseGuards(IntraGuard)
    callBack(@Res() res: Response) {
        // const user = this.authService.
        res.redirect('http://localhost:8000/');
    }
}
