import { Body, Controller, Get, Param, Post, Query, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
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
    const convos = await this.chatService.getConversations(req.user.id);
    res.json(convos);
  }

  @Get('conversations/messages')
  @UseGuards(Jwt2faAuthGuard)
  @UsePipes(ValidationPipe)
  async getConversationMessages(@Req() req, @Query() query: idDto, @Res() res) {
    res.json( await this.chatService.getConversationMessages(req.user.id, parseInt(query.id)) );
  }

  @Post('create')
  @UseGuards(Jwt2faAuthGuard)
  async createGroupChat(@Req() req, @Body() body: CreateGroupChatDTO, @Res() res) {
    res.json( await this.chatService.createGroupChat(req.user.id, body) );
  }

  @Post('join')
  @UseGuards(Jwt2faAuthGuard)
  async joinGroupChat(@Req() req, @Body() body: CreateGroupChatDTO, @Res() res) {
    res.json( await this.chatService.joinGroupChat(req.user.id, body) );
  }

  @Post('leave')
  @UseGuards(Jwt2faAuthGuard)
  async leaveGroupChat(@Req() req, @Body() body: any, @Res() res) {
    res.json( await this.chatService.leaveGroupChat(req.user.id, parseInt(body.roomId)) );
  }

  @Get('/settings/role')
  @UseGuards(Jwt2faAuthGuard)
  async getRole(@Req() req, @Query() param, @Res() res) {
    console.log('settings', param)
    // res.json(await this.chatService.getChatMembers(req.user.id, parseInt(param.id)));
    res.json(await this.chatService.getRole(req.user.id, parseInt(param.id.id)));
  }

  @Get('/settings/staff')
  @UseGuards(Jwt2faAuthGuard)
  async getStaff(@Req() req, @Query() param, @Res() res) {
    console.log("staff", param)
    res.json(await this.chatService.getStaff(req.user.id, parseInt(param.id.id)));
  }

  @Get('/settings/members')
  @UseGuards(Jwt2faAuthGuard)
  async getChatMembers(@Req() req, @Query() param, @Res() res) {
    res.json( await this.chatService.getMembers(req.user.id, parseInt(param.id.id)) );
  }

  @Get('/settings/members/infos')
  @UseGuards(Jwt2faAuthGuard)
  async getMemberInfos(@Req() req, @Query() param, @Res() res) {
    res.json( await this.chatService.getMembersInfos(req.user.id, parseInt(param.id.id), parseInt(param.userId)) );
  }

  @Post('/settings/mute')
  @UseGuards(Jwt2faAuthGuard)
  async muteMember(@Req() req, @Body() body: any, @Res() res) {
    res.json( await this.chatService.muteMember(req.user.id, parseInt(body.roomId), parseInt(body.userId)) );
  }

  @Post('/settings/unmute')
  @UseGuards(Jwt2faAuthGuard)
  async unmuteMember(@Req() req, @Body() body: any, @Res() res) {
    res.json( await this.chatService.muteMember(req.user.id, parseInt(body.roomId), parseInt(body.userId)) );
  }

  @Post('/settings/kick')
  @UseGuards(Jwt2faAuthGuard)
  async kickMember(@Req() req, @Body() body: any, @Res() res) {
    res.json( await this.chatService.kickMember(req.user.id, parseInt(body.roomId), parseInt(body.userId)) );
  }

  @Post('/settings/ban')
  @UseGuards(Jwt2faAuthGuard)
  async banMember(@Req() req, @Body() body: any, @Res() res) {
    res.json( await this.chatService.banMember(req.user.id, parseInt(body.roomId), parseInt(body.userId)) );
  }

}
