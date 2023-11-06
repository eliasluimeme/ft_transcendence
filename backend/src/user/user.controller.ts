import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Jwt2faAuthGuard } from 'src/auth/guards/jwt-2fa.guard';

@Controller('user')
export class UserController {
    constructor(
        private userService: UserService,
    ) {}

    @Post('settings/update') 
    @UseGuards(Jwt2faAuthGuard)
    async updateProfile(@Req() req, @Body() body) {
        return await this.userService.updateUser(req.user.id, body.data);
    }
}
