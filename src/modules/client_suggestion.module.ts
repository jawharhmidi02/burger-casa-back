import { Module } from '@nestjs/common';
import { ClientSuggestionService } from '../services/client_suggestion.service';
import { ClientSuggestionController } from '../controllers/client_suggestion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientSuggestion } from '../entities/client_suggestion.entity';
import { WhatsappMessage } from 'src/entities/whatsapp_message.entity';
import { Organisateur } from 'src/entities/organisateur.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClientSuggestion, WhatsappMessage, Organisateur]),
  ],
  controllers: [ClientSuggestionController],
  providers: [ClientSuggestionService],
})
export class ClientSuggestionModule {}
