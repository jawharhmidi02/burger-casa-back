import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientSuggestion } from 'src/entities/client_suggestion.entity';

@Injectable()
export class PingService {
  private readonly logger = new Logger(PingService.name);

  constructor(
    @InjectRepository(ClientSuggestion)
    private readonly clientSuggestionRepository: Repository<ClientSuggestion>,
  ) {}

  async pingDatabase(): Promise<void> {
    try {
      const count = await this.clientSuggestionRepository.count();
      this.logger.log('Database ping successful, Count: ' + count);
    } catch (error) {
      this.logger.error('Error pinging the database', error);
    }
  }
}
