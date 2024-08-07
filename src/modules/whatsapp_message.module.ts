import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WhatsappMessageController } from 'src/controllers/whatsapp_message.controller';
import { WhatsappMessage } from 'src/entities/whatsapp_message.entity';
import { WhatsappMessageService } from 'src/services/whatsapp_message.service';

@Module({
  imports: [TypeOrmModule.forFeature([WhatsappMessage])],
  controllers: [WhatsappMessageController],
  providers: [WhatsappMessageService],
})
export class WhatsappMessageModule {}
