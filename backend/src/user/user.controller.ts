import { BadGatewayException, BadRequestException, Body, Controller, FileTypeValidator, Get, HttpException, HttpStatus, MaxFileSizeValidator, Param, ParseFilePipe, Post, Query, Req, Res, UnauthorizedException, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { Jwt2faAuthGuard } from 'src/auth/guards/jwt-2fa.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Express, Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtSecretRequestType } from '@nestjs/jwt';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

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
    @UseGuards(JwtAuthGuard)
    async getProfile(@Req() req, @Res() res) {
      res.json( await this.userService.getProfile(req.user) );
    }

    @Get('ladderboard')
    @UseGuards(Jwt2faAuthGuard)
    async getladderBoard(@Req() req, @Res() res) {
      res.json( await this.userService.getLadderboard(4) );
    }

    @Get('ladderboard/rank')
    @UseGuards(Jwt2faAuthGuard)
    async getRank(@Req() req, @Res() res) {
      res.json( await this.userService.getRank(req.user.level.level) );
    }

    @Get('friends')
    @UseGuards(Jwt2faAuthGuard)
    async getFriends(@Body() body: any, @Req() req: any) {
        return await this.userService.getFriends( req.user.id );
    }

    @Get('friends/friendship')
    @UseGuards(Jwt2faAuthGuard)
    async getFriendship(@Query() param: any, @Req() req: any, @Res() res) {
        res.json( await this.userService.getFriendship( req.user.id, parseInt(param.id) ));
    }

    @Get('friends/add')
    @UseGuards(Jwt2faAuthGuard)
    async addFriend(@Query() param: any, @Req() req: any) {
      console.log('hnaaaaaa', param)
        return await this.userService.addFriend(req.user.id, parseInt(param.id) );
    }

    @Get('friends/accept')
    @UseGuards(Jwt2faAuthGuard)
    async acceptFriend(@Query() param: any, @Req() req: any) {
        return await this.userService.acceptFriend(req.user.id, parseInt(param.id) );
    }

    @Get('friends/reject')
    @UseGuards(Jwt2faAuthGuard)
    async rejectFriend(@Query() param: any, @Req() req: any) {
        return await this.userService.rejectFriend(req.user.Id, parseInt(param.id));
    }

    @Get('friends/unfriend')
    @UseGuards(Jwt2faAuthGuard)
    async unfriend(@Query() param: any, @Req() req: any) {
        return await this.userService.unfriend(req.user.Id, parseInt(param.id));
    }

    @Get('users/search')
    @UseGuards(Jwt2faAuthGuard)
    async checkUser(@Req() req, @Query() params: any, @Res() res) {
      res.json( await this.userService.checkUser( req.user.id, params.user ) );
    }

    @Get('users/profile')
    @UseGuards(Jwt2faAuthGuard)
    async getUserProfile(@Req() req: any, @Query() params: any, @Res() res) {
      console.log('users profile', params.user)
      res.json( await this.userService.searchUser( req.user, params.user ) );
    }

    @Get('users/achievement')
    @UseGuards(Jwt2faAuthGuard)
    async getUserAchievement(@Req() req: any, @Query() params: any, @Res() res) {
      console.log('users achievement', params.id)
      res.json( await this.userService.searchUserAchievements( params.user ) );
    }

    @Get('users/matchs')
    @UseGuards(Jwt2faAuthGuard)
    async getUserMatchHistory(@Req() req: any, @Query() params: any, @Res() res) {
      console.log('users matchs', params.user)
      res.json( await this.userService.searchUserMatchHistory( params.user ) );
    }

    @Get('users/blocks')
    @UseGuards(Jwt2faAuthGuard)
    async getBlocks(@Req() req, @Query() param: any, @Res() res) {
      res.json( await this.userService.getBlockStatus(req.user.id, parseInt(param.id)) );
    }

    @Get('users/block')
    @UseGuards(Jwt2faAuthGuard)
    async blockUser(@Req() req, @Query() param: any, @Res() res) {
      res.json( await this.userService.blockUser(req.user.id, parseInt(param.id)) );
    }

    @Get('users/unblock')
    @UseGuards(Jwt2faAuthGuard)
    async unblockUser(@Req() req, @Query() param: any, @Res() res) {
      res.json( await this.userService.unblockUser(req.user.id, parseInt(param.id)) );
    }

    @Get('settings')
    @UseGuards(Jwt2faAuthGuard)
    async getSettingsData(@Req() req: any): Promise<any> {
        return await this.userService.findUserByIntraId(req.user.intraId);
    }

    @Post('settings/update') 
    @UseGuards(Jwt2faAuthGuard)
    async updateProfile(@Req() req, @Body() body): Promise<any> {
        console.log(req.user)
        return await this.userService.updateProfile(req.user.intraId, body);
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
}
