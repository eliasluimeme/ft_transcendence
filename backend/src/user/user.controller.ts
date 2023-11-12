import { Body, Controller, Get, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { Jwt2faAuthGuard } from 'src/auth/guards/jwt-2fa.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { extname } from 'path';
import { Express, Request, Response } from 'express';

interface fileParams {
    fileName: string;
}

@Controller()
export class UserController {
    constructor(
        private userService: UserService,
    ) {}

    @Get('photo')
    @UseGuards(Jwt2faAuthGuard)
    async getPhoto(@Req() req: any, @Res({ passthrough: true }) res: Response, @Body() body: fileParams): Promise<any> {
        const user = await this.userService.findUserById(req.user.id);
        // const photo = await fs.readFile(`./uploads/${user.photo}`);
        res.writeHead(200, { 'Content-Type': 'image/png' });
        // res.end(photo, 'binary');
        return res.sendFile(path.join(__dirname, '../uploads/' + user.photo))
    }

    @Post('photo/upload')
    @UseGuards(Jwt2faAuthGuard)
    @UseInterceptors(
        FileInterceptor('file', {
          storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
              cb(null, `${file.originalname}`);
            },
          }),
        }),
      )
    async uploadPhoto(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
        const user = await this.userService.updateUser(req.user.id, { photo: file.filename });

        return { message: 'File uploaded successfully' };
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
