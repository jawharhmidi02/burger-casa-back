import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PingService } from 'src/services/ping_database.service';

const { URL } = process.env;

@Injectable()
export class PingTaskService implements OnModuleInit {
  private readonly logger = new Logger(PingService.name);

  constructor(private readonly pingService: PingService) {}

  onModuleInit() {
    this.startPingingDatabase();
  }

  async startPingingDatabase() {
    setInterval(async () => {
      try {
        const response = await fetch(`${URL}ping-database`);

        if (response.ok) {
          this.logger.log('Server ping successful');
        } else {
          this.logger.warn('Server ping failed with status:', response.status);
        }
      } catch (error) {
        this.logger.error('Error pinging server:', error);
      }
    }, 60000);
  }
}
