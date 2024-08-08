import { Injectable, OnModuleInit } from '@nestjs/common';
import { PingService } from 'src/services/ping_database.service';

@Injectable()
export class PingTaskService implements OnModuleInit {
  constructor(private readonly pingService: PingService) {}

  onModuleInit() {
    this.startPingingDatabase();
  }

  startPingingDatabase() {
    setInterval(() => {
      this.pingService.pingDatabase();
    }, 30000);
  }
}
