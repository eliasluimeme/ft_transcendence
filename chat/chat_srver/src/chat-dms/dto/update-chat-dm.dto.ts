import { PartialType } from '@nestjs/mapped-types';
import { CreateChatDmDto } from './create-chat-dm.dto';

export class UpdateChatDmDto extends PartialType(CreateChatDmDto) {
  id: number;
}
