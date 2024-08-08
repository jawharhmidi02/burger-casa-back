import { Controller, Get, Post, Body, Headers, Param, Delete, Put } from '@nestjs/common';
import { WhatsappMessageService } from '../services/whatsapp_message.service';
import { WhatsappMessageFromEntity } from 'src/dto/whatsapp_message.dto';
import { WhatsappMessageToEntity } from 'src/dto/whatsapp_message.dto';

@Controller('whatsapp_messages')
export class WhatsappMessageController {
  constructor(private readonly whatsappMessageService: WhatsappMessageService) {}

  @Post()
  create(@Body() clientSuggestion: WhatsappMessageToEntity): Promise<WhatsappMessageFromEntity> {
    return this.whatsappMessageService.create(clientSuggestion);
  }

  @Get()
  findAll(): Promise<WhatsappMessageFromEntity[]> {
    return this.whatsappMessageService.findAll();
  }

  @Get('/byid/:id')
  findById(@Param('id') id: string): Promise<WhatsappMessageFromEntity> {
    return this.whatsappMessageService.findById(id);
  }

  @Get('/bymessageid/:id')
  findByMessageId(@Param('id') id: string): Promise<WhatsappMessageFromEntity> {
    return this.whatsappMessageService.findByMessageId(id);
  }

  @Get('/byorderid/:id')
  findByOrderId(@Param('id') id: string): Promise<WhatsappMessageFromEntity[]> {
    return this.whatsappMessageService.findByOrderId(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Headers('access_token') access_token: string): Promise<WhatsappMessageFromEntity> {
    return this.whatsappMessageService.delete(id, access_token);
  }
}
