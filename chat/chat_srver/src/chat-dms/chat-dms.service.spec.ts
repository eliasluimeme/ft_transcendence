import { Test, TestingModule } from '@nestjs/testing';
import { ChatDmsService } from './chat-dms.service';

describe('ChatDmsService', () => {
  let service: ChatDmsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatDmsService],
    }).compile();

    service = module.get<ChatDmsService>(ChatDmsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
