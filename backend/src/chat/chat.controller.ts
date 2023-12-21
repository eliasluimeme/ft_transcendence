import { Body, Controller, Get, Param, Post, Query, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Jwt2faAuthGuard } from 'src/auth/guards/jwt-2fa.guard';
import { CreateGroupChatDTO } from './dto/createGroupChat.dto';
import { idDto } from './dto/id.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // get conversations
  // get conversations messages
  // create group chat
  // join group chat

  @Get('conversations')
  @UseGuards(Jwt2faAuthGuard)
  async getConversations(@Req() req, @Res() res) {
    const convos = await this.chatService.getConversations(req.user.id);
    // console.log("conv:", convos);
    res.json(convos);
  }

  @Get('conversations/messages')
  @UseGuards(Jwt2faAuthGuard)
  @UsePipes(ValidationPipe)
  async getConversationMessages(@Req() req, @Query() query: idDto, @Res() res) {
    const messages = await this.chatService.getConversationMessages(req.user.id, parseInt(query.id));
    console.log(messages[0].messages);
    res.json(messages);
  }

  @Post('create')
  @UseGuards(Jwt2faAuthGuard)
  async createGroupChat(@Req() req, @Body() body: CreateGroupChatDTO, @Res() res) {
    const groupChat = await this.chatService.createGroupChat(req.user.id, body);
    res.json(groupChat);
  }

  @Post('join')
  @UseGuards(Jwt2faAuthGuard)
  async joinGroupChat(@Req() req, @Body() body: CreateGroupChatDTO, @Res() res) {
    const groupChat = await this.chatService.joinGroupChat(req.user.id, body);
    res.json(groupChat);
  }

  @Post('leave')
  @UseGuards(Jwt2faAuthGuard)
  async leaveGroupChat(@Req() req, @Body() body: any, @Res() res) {
    const groupChat = await this.chatService.leaveGroupChat(req.user.id, parseInt(body.roomId));
    res.json(groupChat);
  }



  @Get('/settings')
  @UseGuards(Jwt2faAuthGuard)
  async getRole(@Req() req, @Query() param, @Res() res) {
    console.log('settings', param)
    const settings = await this.chatService.getChatMembers(req.user.id, parseInt(param.id));
    res.json(settings);
  }

  // Get('/settings/members')
  // @UseGuards(Jwt2faAuthGuard)
  // async getChatMembers(@Req() req, @Query() param, @Res() res) {
  //   console.log('settings', param)
  //   const settings = await this.chatService.getChatMembers(req.user.id, parseInt(param.id));
  //   res.json(settings);
  // }

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
    // res.json( await this.chatService.banMember(req.user.id, parseInt(body.roomId), parseInt(body.userId)) );
  }

}
