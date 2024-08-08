import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebHookController } from 'src/controllers/webhook.controller';
import { CommandeService } from 'src/services/commande.service';
import { WebHookService } from 'src/services/webhook.service';
import { WhatsappMessageService } from 'src/services/whatsapp_message.service';
import { WhatsappMessage } from 'src/entities/whatsapp_message.entity';
import { Commande } from 'src/entities/commande.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([WhatsappMessage, Commande]), HttpModule],
  controllers: [WebHookController],
  providers: [WebHookService, WhatsappMessageService, CommandeService],
})
export class WebHookModule {}
