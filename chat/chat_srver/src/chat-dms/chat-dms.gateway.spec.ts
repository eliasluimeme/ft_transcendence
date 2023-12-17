import { Test, TestingModule } from '@nestjs/testing';
import { ChatDmsGateway } from './chat-dms.gateway';
import { ChatDmsService } from './chat-dms.service';

describe('ChatDmsGateway', () => {
  let gateway: ChatDmsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatDmsGateway, ChatDmsService],
    }).compile();

    gateway = module.get<ChatDmsGateway>(ChatDmsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
