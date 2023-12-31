import { Body, Controller, Get, Post, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { Jwt2faAuthGuard } from 'src/auth/guards/jwt-2fa.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Express } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { settingsDTO } from './dto/settings.dto';
import { userIdDTO } from './dto/userId.dto';
import { userNameDTO } from './dto/userName.dto';

@Controller()
export class UserController {
    constructor(
        private userService: UserService,
        private configService: ConfigService,
    ) {}

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    async getProfile(@Req() req, @Res() res): Promise<any> {
      res.json( await this.userService.getProfile(req.user) );
    }

    @Get('ladderboard')
    @UseGuards(Jwt2faAuthGuard)
    async getladderBoard(@Req() req, @Res() res): Promise<any> {
      res.json( await this.userService.getLadderboard(4) );
    }

    @Get('ladderboard/rank')
    @UseGuards(Jwt2faAuthGuard)
    async getRank(@Req() req, @Res() res): Promise<any> {
      res.json( await this.userService.getRank(req.user.level.level) );
    }

    @Get('friends')
    @UseGuards(Jwt2faAuthGuard)
    async getFriends(@Body() body: any, @Req() req: any): Promise<any> {
        return await this.userService.getFriends( req.user.id );
    }

    @Get('friends/friendship')
    @UseGuards(Jwt2faAuthGuard)
    @UsePipes(ValidationPipe)
    async getFriendship(@Query() param: userIdDTO, @Req() req: any, @Res() res): Promise<any> {
        res.json( await this.userService.getFriendship( req.user.id, parseInt(param.id) ));
    }

    @Get('friends/add')
    @UseGuards(Jwt2faAuthGuard)
    @UsePipes(ValidationPipe)
    async addFriend(@Query() param: userIdDTO, @Req() req: any): Promise<any> {
        return await this.userService.addFriend(req.user.id, parseInt(param.id) );
    }

    @Get('friends/accept')
    @UseGuards(Jwt2faAuthGuard)
    @UsePipes(ValidationPipe)
    async acceptFriend(@Query() param: userIdDTO, @Req() req: any): Promise<any> {
        return await this.userService.acceptFriend(req.user.id, parseInt(param.id) );
    }

    @Get('friends/reject')
    @UseGuards(Jwt2faAuthGuard)
    @UsePipes(ValidationPipe)
    async rejectFriend(@Query() param: userIdDTO, @Req() req: any): Promise<any> {
        return await this.userService.rejectFriend(req.user.Id, parseInt(param.id));
    }

    @Get('friends/unfriend')
    @UseGuards(Jwt2faAuthGuard)
    @UsePipes(ValidationPipe)
    async unfriend(@Query() param: userIdDTO, @Req() req: any): Promise<any> {
        return await this.userService.unfriend(req.user.Id, parseInt(param.id));
    }

    @Get('users/search')
    @UseGuards(Jwt2faAuthGuard)
    @UsePipes(ValidationPipe)
    async checkUser(@Req() req, @Query() params: userNameDTO, @Res() res): Promise<any> {
      res.json( await this.userService.checkUser( req.user.id, params.user ) );
    }

    @Get('users/profile')
    @UseGuards(Jwt2faAuthGuard)
    @UsePipes(ValidationPipe)
    async getUserProfile(@Req() req: any, @Query() params: userNameDTO, @Res() res): Promise<any> {
      res.json( await this.userService.searchUser( req.user, params.user ) );
    }

    @Get('users/achievement')
    @UseGuards(Jwt2faAuthGuard)
    @UsePipes(ValidationPipe)
    async getUserAchievement(@Req() req: any, @Query() params: userNameDTO, @Res() res): Promise<any> {
      res.json( await this.userService.searchUserAchievements( params.user ) );
    }

    @Get('users/matchs')
    @UseGuards(Jwt2faAuthGuard)
    @UsePipes(ValidationPipe)
    async getUserMatchHistory(@Req() req: any, @Query() params: userNameDTO, @Res() res): Promise<any> {
      res.json( await this.userService.searchUserMatchHistory( req.user, params.user ) );
    }

    @Get('users/blocks')
    @UseGuards(Jwt2faAuthGuard)
    @UsePipes(ValidationPipe)
    async getBlocks(@Req() req, @Query() param: userIdDTO, @Res() res): Promise<any> {
      res.json( await this.userService.getBlockStatus(req.user.id, parseInt(param.id)) );
    }

    @Get('users/block')
    @UseGuards(Jwt2faAuthGuard)
    @UsePipes(ValidationPipe)
    async blockUser(@Req() req, @Query() param: userIdDTO, @Res() res): Promise<any> {
      res.json( await this.userService.blockUser(req.user.id, parseInt(param.id)) );
    }

    @Get('users/unblock')
    @UseGuards(Jwt2faAuthGuard)
    @UsePipes(ValidationPipe)
    async unblockUser(@Req() req, @Query() param: userIdDTO, @Res() res): Promise<any> {
      res.json( await this.userService.unblockUser(req.user.id, parseInt(param.id)) );
    }

    @Get('settings')
    @UseGuards(Jwt2faAuthGuard)
    async getSettingsData(@Req() req: any): Promise<any> {
        return await this.userService.getSettings(req.user.intraId);
    }
    
    @Post('settings/update') 
    @UseGuards(Jwt2faAuthGuard)
    // @UsePipes(ValidationPipe)
    async updateProfile(@Req() req, @Body() body: any): Promise<settingsDTO> {
      return await this.userService.updateProfile(req.user.intraId, body);
    }

    @Post('settings/avatar')
    @UseGuards(Jwt2faAuthGuard)
    async updateAvatar(@Req() req, @Body() body: any): Promise<any> {
      return await this.userService.updateAvatar(req.user.id, body.photo);
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
          limits: { fileSize: 1024 * 1024 * 10 },
          storage: diskStorage({ destination: './uploads',
            filename: (req, photo, cb) => {
              cb(null, `${photo.originalname}`);
            },
          }),
        }),
      )
    async uploadPhoto(@UploadedFile() photo: Express.Multer.File, @Req() req: any): Promise<any> {
        try {
          const user = await this.userService.updateUser(req.user.id, { photo: this.configService.get('BACKEND_URL') + photo.filename });
          return { photo: user.photo };
        } catch( error ) {
            throw error;
        }
    }
  
    @Post('game/invite')
    @UseGuards(Jwt2faAuthGuard)
    async gameInvite(@Req() req, @Body() body: any, @Res() res): Promise<any> {
      res.json( await this.userService.gameInvite(req.user.id, body) );
    }

}
