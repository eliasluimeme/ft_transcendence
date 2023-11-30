import { BadGatewayException, BadRequestException, Body, Controller, FileTypeValidator, Get, HttpException, HttpStatus, MaxFileSizeValidator, ParseFilePipe, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { Jwt2faAuthGuard } from 'src/auth/guards/jwt-2fa.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Express, Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

interface fileParams {
    fileName: string;
}

@Controller()
export class UserController {
    constructor(
        private userService: UserService,
        private configService: ConfigService,
    ) {}

    @Get('photo')
    @UseGuards(Jwt2faAuthGuard)
    async getPhoto(@Req() req: any, @Body() body: fileParams): Promise<any> {
        const user = await this.userService.findUserById(req.user.id);
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
    async search(@Body() body: any) {
        return await this.userService.searchUsers(body.search);
    }

    @Post('friends/add')
    @UseGuards(Jwt2faAuthGuard)
    async addFriend(@Body() friend: any, @Req() req: any) {
        return await this.userService.addFriend(req.user.id, friend.id);
    }

    @Get('settings')
    @UseGuards(Jwt2faAuthGuard)
    async getSettingsData(@Req() req: any): Promise<any> {
        return await this.userService.findUserById(req.user.id);
    }

    @Post('settings/update') 
    @UseGuards(Jwt2faAuthGuard)
    async updateProfile(@Req() req, @Body() body): Promise<any> {
        return await this.userService.updateProfile(req.user.id, body);
    }
}
