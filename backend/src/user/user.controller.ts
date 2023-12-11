import { BadGatewayException, BadRequestException, Body, Controller, FileTypeValidator, Get, HttpException, HttpStatus, MaxFileSizeValidator, ParseFilePipe, Post, Req, Res, UnauthorizedException, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { Jwt2faAuthGuard } from 'src/auth/guards/jwt-2fa.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Express, Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtSecretRequestType } from '@nestjs/jwt';

interface fileParams {
    fileName: string;
}

@Controller()
export class UserController {
    constructor(
        private userService: UserService,
        private configService: ConfigService,
    ) {}

    @Get('home')
    @UseGuards(Jwt2faAuthGuard)
    async home(@Req() req, @Res() res) {

    }

    @Get('profile')
    @UseGuards(Jwt2faAuthGuard)
    async getProfile(@Req() req, @Res() res) {
      const profile = await this.userService.getProfile(req.user);
      res.json(profile);
    }

    @Get('ladderBoard')
    @UseGuards(Jwt2faAuthGuard)
    async getladderBoard(@Req() req, @Res() res) {
      const ladderBoard = await this.userService.getLadderboard(10);
      res.json(ladderBoard);
    }

    @Get('photo')
    @UseGuards(Jwt2faAuthGuard)
    async getPhoto(@Req() req: any, @Body() body: fileParams): Promise<any> {
      const user = await this.userService.findUserByIntraId(req.user.id);
      return user.photo;
    }

    @Post('photo/upload')
    @UseGuards(Jwt2faAuthGuard)
    @UseInterceptors(
        FileInterceptor('photo', {
          fileFilter: (req, photo, cb) => {
            if (!photo.originalname.match(/\.(jpg|jpeg|png|gif)$/))
              return cb(null , false);
            cb(null, true);
          },
          limits: { fileSize: 1024 * 1024 * 10 }, // 10 MB file size limit
          storage: diskStorage({ destination: './uploads',
            filename: (req, photo, cb) => {
              cb(null, `${photo.originalname}`);
            },
          }),
        }),
      )
    async uploadPhoto(@UploadedFile() photo: Express.Multer.File, @Req() req: any) {
        try { // handle in front the response status + protect when ther is nothing uploaded + delete privious one
          const user = await this.userService.updateUser(req.user.id, { photo: this.configService.get('BACKEND_URL') + photo.filename });
          return { photo: user.photo };
        } catch( error ) {
            throw error;
        }
    }

    @Post('search')
    @UseGuards(Jwt2faAuthGuard)
    async search(@Req() req: any, @Res() res) {
      console.log(req.user)
      const us = await this.userService.searchUsers(req.user.id, req.body.search)
      console.log(us);
      res.json(us);
    }

    @Post('friends/add')
    @UseGuards(Jwt2faAuthGuard)
    async addFriend(@Body() body: any, @Req() req: any) {
        return await this.userService.addFriend(req.user.id, parseInt(body.friend));
    }

    @Post('friends/accept')
    @UseGuards(Jwt2faAuthGuard)
    async acceptFriend(@Body() body: any, @Req() req: any) {
        return await this.userService.acceptFriend(req.user.id, parseInt(body.friend));
    }

    @Post('friends/reject')
    @UseGuards(Jwt2faAuthGuard)
    async rejectFriend(@Body() body: any, @Req() req: any) {
        return await this.userService.rejectFriend(req.body.userId, parseInt(body.friend));
    }

    @Get('users/:userId')
    @UseGuards(Jwt2faAuthGuard)
    async getUser() {

    }

    @Get('users/:userId/block')
    @UseGuards(Jwt2faAuthGuard)
    async blockUser(@Req() req, @Res() res) {

    }

    @Get('users/:userId/unblock')
    @UseGuards(Jwt2faAuthGuard)
    async unblockUser(@Req() req, @Res() res) {
      
    }

    @Get('settings')
    @UseGuards(Jwt2faAuthGuard)
    async getSettingsData(@Req() req: any): Promise<any> {
        return await this.userService.findUserByIntraId(req.user.intraId);
    }

    @Post('settings/update') 
    @UseGuards(Jwt2faAuthGuard)
    async updateProfile(@Req() req, @Body() body): Promise<any> {
        return await this.userService.updateProfile(req.user.id, body);
    }
}
