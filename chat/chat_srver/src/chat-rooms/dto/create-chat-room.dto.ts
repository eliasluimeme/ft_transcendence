import { Message } from 'src/messages/entities/message.entity';

export class CreateChatRoomDto extends Message {
  name: string;
  message: string;
}
