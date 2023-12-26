import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { Jwt2faAuthGuard } from 'src/auth/guards/jwt-2fa.guard';
import { CreateGroupChatDTO } from './dto/createGroupChat.dto';
import { idDto } from './dto/id.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('conversations')
  @UseGuards(Jwt2faAuthGuard)
  async getConversations(@Req() req, @Res() res) {
    res.json( await this.chatService.getConversations(req.user.id));
  }

  @Get('conversations/members')
  @UseGuards(Jwt2faAuthGuard)
  async getConvoMembers(@Req() req, @Query() query, @Res() res) {
    res.json( await this.chatService.getConvoMembers(req.user.id, parseInt(query.id)),);
  }

  @Get('conversations/infos')
  @UseGuards(Jwt2faAuthGuard)
  async getRoomInfos(@Req() req, @Query() query, @Res() res) {
    res.json( await this.chatService.getRoomInfos(parseInt(query.id)) );
  }

  @Get('conversations/messages')
  @UseGuards(Jwt2faAuthGuard)
  @UsePipes(ValidationPipe)
  async getConversationMessages(@Req() req, @Query() query: idDto, @Res() res) {
    res.json( await this.chatService.getConversationMessages( req.user.id, parseInt(query.id) ) );
  }

  @Post('create')
  @UseGuards(Jwt2faAuthGuard)
  async createGroupChat( @Req() req, @Body() body: CreateGroupChatDTO, @Res() res ) {
    res.json(await this.chatService.createGroupChat(req.user.id, body));
  }

  @Post('join')
  @UseGuards(Jwt2faAuthGuard)
  async joinGroupChat( @Req() req, @Body() body: CreateGroupChatDTO, @Res() res ) {
    res.json(await this.chatService.joinGroupChat(req.user.id, body));
  }

  @Post('leave')
  @UseGuards(Jwt2faAuthGuard)
  async leaveGroupChat(@Req() req, @Body() body: any, @Res() res) {
    res.json( await this.chatService.leaveGroupChat(req.user.id, parseInt(body.roomId)) );
  }

  @Get('/settings/role')
  @UseGuards(Jwt2faAuthGuard)
  async getRole(@Req() req, @Query() param, @Res() res) {
    res.json(await this.chatService.getRole(req.user.id, parseInt(param.id)));
  }

  @Get('/settings/staff')
  @UseGuards(Jwt2faAuthGuard)
  async getStaff(@Req() req, @Query() param, @Res() res) {
    res.json(await this.chatService.getStaff(req.user.id, parseInt(param.id)));
  }

  @Get('/settings/members')
  @UseGuards(Jwt2faAuthGuard)
  async getChatMembers(@Req() req, @Query() param, @Res() res) {
    res.json( await this.chatService.getMembers(req.user.id, parseInt(param.id)) );
  }

  @Get('/settings/members/infos')
  @UseGuards(Jwt2faAuthGuard)
  async getMemberInfos(@Req() req, @Query() param, @Res() res) {
    res.json( await this.chatService.getMembersInfos(req.user.id, parseInt(param.id), parseInt(param.userId)) );
  }

  @Post('/settings/mute')
  @UseGuards(Jwt2faAuthGuard)
  async muteMember(@Req() req, @Body() body: any, @Res() res) {
    res.json( await this.chatService.muteMember( req.user.id, parseInt(body.roomId), parseInt(body.userId),) );
  }

  // @Post('/settings/unmute')
  // @UseGuards(Jwt2faAuthGuard)
  // async unmuteMember(@Req() req, @Body() body: any, @Res() res) {
  //   res.json( await this.chatService.unmuteMember(req.user.id, parseInt(body.roomId), parseInt(body.userId)) );
  // }

  @Post('/settings/kick')
  @UseGuards(Jwt2faAuthGuard)
  async kickMember(@Req() req, @Body() body: any, @Res() res) {
    res.json( await this.chatService.kickMember( req.user.id, parseInt(body.roomId), parseInt(body.userId), ) );
  }

  @Post('/settings/ban')
  @UseGuards(Jwt2faAuthGuard)
  async banMember(@Req() req, @Body() body: any, @Res() res) {
    res.json(
      await this.chatService.banMember(
        req.user.id,
        parseInt(body.roomId),
        parseInt(body.userId),
      ),
    );
  }

  @Post('/settings/leave')
  @UseGuards(Jwt2faAuthGuard)
  async leaveRoom(@Req() req, @Body() param, @Res() res) {
    // console.log('aralhna', param)
    res.json(await this.chatService.leaveRoom(req.user.id, parseInt(param.id)));
  }

  // @Post('/settings/leave')
  // @UseGuards(Jwt2faAuthGuard)
  // async leaveRoom(@Req() req, @Body() param, @Res() res) {
  //   res.json( await this.chatService.leaveRoom(req.user.id, parseInt(param.roomId)) );
  // }

  // @Post('/settings/leave')
  // @UseGuards(Jwt2faAuthGuard)
  // async leaveRoom(@Req() req, @Body() param, @Res() res) {
  //   res.json( await this.chatService.leaveRoom(req.user.id, parseInt(param.roomId)) );
  // }

  @Post('/settings/update')
  @UseGuards(Jwt2faAuthGuard)
  async changeRoomPw(@Req() req, @Body() body: any, @Res() res) {
    res.json( await this.chatService.changeRoomPw(req.user.id, parseInt(body.roomId), body.newPassword) );
  }

  @Post('/settings/delete')
  @UseGuards(Jwt2faAuthGuard)
  async disableRoomPw(@Req() req, @Body() body: any, @Res() res) {
    res.json( await this.chatService.disableRoomPw(req.user.id, parseInt(body.roomId)) );
  }

  @Post('/settings/add/admin')
  @UseGuards(Jwt2faAuthGuard)
  async setAdmin(@Req() req, @Body() body: any, @Res() res) {
    res.json( await this.chatService.addAdmin(req.user.id, parseInt(body.roomId), parseInt(body.userId)) );
  }

  @Post('/settings/add/member')
  @UseGuards(Jwt2faAuthGuard)
  async addMember(@Req() req, @Body() body: any, @Res() res) {
    res.json( await this.chatService.addMember(req.user.id, parseInt(body.roomId), body.userName) );
  }

  @Post('messages/add')
  @UseGuards(Jwt2faAuthGuard)
  async addMessage(@Req() req, @Body() body: any, @Res() res) {
    res.json( await this.chatService.addMessage( req.user.id, parseInt(body.roomId), body.message,) );
  }

}
