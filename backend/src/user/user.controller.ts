import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Jwt2faAuthGuard } from 'src/auth/guards/jwt-2fa.guard';


@Controller()
export class UserController {
    constructor(
        private userService: UserService,
    ) {}

    @Get('settings')
    @UseGuards(Jwt2faAuthGuard)
    async getSettingsData(@Req() req): Promise<any> {
        return await this.userService.findUserById(req.user.id);
    }

    @Post('settings/update') 
    @UseGuards(Jwt2faAuthGuard)
    async updateProfile(@Req() req, @Body() body): Promise<any> {
        console.log(body);
        return await this.userService.updateUser(req.user.id, body);
    }
}
