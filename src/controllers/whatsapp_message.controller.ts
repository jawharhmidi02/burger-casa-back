import { Controller, Get, Post, Body, Headers, Param, Delete, Put } from '@nestjs/common';
import { WhatsappMessageService } from '../services/whatsapp_message.service';
import { WhatsappMessageFromEntity } from 'src/dto/whatsapp_message.dto';
import { WhatsappMessageToEntity } from 'src/dto/whatsapp_message.dto';

@Controller('whatsapp_messages')
export class WhatsappMessageController {
  constructor(private readonly clientSuggestionService: WhatsappMessageService) {}

  @Post()
  create(@Body() clientSuggestion: WhatsappMessageToEntity): Promise<WhatsappMessageFromEntity> {
    return this.clientSuggestionService.create(clientSuggestion);
  }

  @Get()
  findAll(): Promise<WhatsappMessageFromEntity[]> {
    return this.clientSuggestionService.findAll();
  }

  @Get('/byid/:id')
  findById(@Param('id') id: string): Promise<WhatsappMessageFromEntity> {
    return this.clientSuggestionService.findById(id);
  }

  @Get('/bymessageid/:id')
  findByMessageId(@Param('id') id: string): Promise<WhatsappMessageFromEntity> {
    return this.clientSuggestionService.findByMessageId(id);
  }

  @Get('/byorderid/:id')
  findByOrderId(@Param('id') id: string): Promise<WhatsappMessageFromEntity[]> {
    return this.clientSuggestionService.findByOrderId(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Headers('access_token') access_token: string): Promise<WhatsappMessageFromEntity> {
    return this.clientSuggestionService.delete(id, access_token);
  }
}
