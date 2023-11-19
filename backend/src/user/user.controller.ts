import { BadRequestException, Body, Controller, Get, HttpException, HttpStatus, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { Jwt2faAuthGuard } from 'src/auth/guards/jwt-2fa.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';

import { Express, Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ValidateFileInterceptor } from './interceptor/file.interceptor';

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
          fileFilter: (req, file, cb) => {
            const fileSize = 10 * 1024 * 1024;
            const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
            console.log( )
            console.log(file)
            console.log(file.size)
            console.log(file.originalname)
            // if (file.size > fileSize)
            //   return cb(new HttpException('Invalid file size', HttpStatus.BAD_REQUEST), false);
            if (!allowedExtensions.includes(file.originalname.split('.').pop().toLowerCase()))
              return cb(new HttpException('Invalid file extension', HttpStatus.BAD_REQUEST), false);

            cb(null, true);
          },
          storage: diskStorage({
            destination: './uploads',
            filename: (req, photo, cb) => {
              cb(null, `${photo.originalname}`);
            },
          }),
        }),
      )
    async uploadPhoto(@UploadedFile() photo: Express.Multer.File, @Req() req: any) {
        try { // handle in front the response status + protect when ther is nothing uploaded
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
