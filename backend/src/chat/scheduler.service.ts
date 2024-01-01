import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ChatService } from './chat.service';

@Injectable()
export class SchedulerService {
  constructor(private readonly chatService: ChatService) {}

  async onModuleInit() {
    // Run the unmuteExpiredFriends method on app start to clear any expired mutes
    await this.chatService.unmutescheduler()
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async handleMuteExpiration() {
    await this.chatService.unmutescheduler()  
  }
}
