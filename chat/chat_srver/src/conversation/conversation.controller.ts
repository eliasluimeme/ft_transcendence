import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { Message } from 'src/messages/entities/message.entity';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Get()
  async getConversation(): Promise<Message[]> {
    return this.conversationService.getConversation();
  }

  @Post('chatDms')
  async createChatConversation(
    @Body('msgId', ParseIntPipe) msgId: number,
    @Body('userSenderId', ParseIntPipe) userSenderId: number,
    @Body('msgContent') msgContent: string,
  ): Promise<Message> {
    return this.conversationService.createChatConversation(
      msgId,
      userSenderId,
      msgContent,
    );
  }

  @Post('chatRoom')
  async createRoomConversation(
    @Body('roomId', ParseIntPipe)
    roomId: number,
    @Body('userSenderId', ParseIntPipe)
    userSenderId: number,
    @Body('msgContent') msgContent: string,
  ): Promise<Message> {
    return this.conversationService.createRoomConversation(
      roomId,
      userSenderId,
      msgContent,
    );
  }
}

@Get('chatDm/:chatDmId')
async getChatMessages(
  @Param('chatDmId', ParseIntPipe) chatDmId,
): Promise<Message[]> {
  return this.conversationService.getConversation(
    chatDmId,
  ),
}

  @Get()
  findAll() {
    return this.conversationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.conversationService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateConversationDto: UpdateConversationDto,
  ) {
    return this.conversationService.update(+id, updateConversationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.conversationService.remove(+id);
  }
}
function getChatMessages(arg0: any, chatDmId: any) {
  throw new Error('Function not implemented.');
}

function findAll() {
  throw new Error('Function not implemented.');
}

function findOne(arg0: any, id: any, string: any) {
  throw new Error('Function not implemented.');
}

function remove(arg0: any, id: any, string: any) {
  throw new Error('Function not implemented.');
}

