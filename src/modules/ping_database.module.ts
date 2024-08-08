import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PingService } from 'src/services/ping_database.service';
import { PingTaskService } from 'src/services/ping_database_task.service';
import { ClientSuggestion } from 'src/entities/client_suggestion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClientSuggestion])],
  providers: [PingService, PingTaskService],
})
export class PingModule {}
