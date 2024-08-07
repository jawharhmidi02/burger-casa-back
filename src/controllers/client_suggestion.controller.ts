import { Controller, Get, Post, Body, Headers, Param, Delete, Put } from '@nestjs/common';
import { ClientSuggestionService } from '../services/client_suggestion.service';
import { ClientSuggestionFromEntity } from 'src/dto/client_suggestion.dto';
import { ClientSuggestionToEntity } from 'src/dto/client_suggestion.dto';

@Controller('client_suggestions')
export class ClientSuggestionController {
  constructor(private readonly clientSuggestionService: ClientSuggestionService) {}

  @Post()
  create(@Body() clientSuggestion: ClientSuggestionToEntity): Promise<ClientSuggestionFromEntity> {
    return this.clientSuggestionService.create(clientSuggestion);
  }

  @Get()
  findAll(): Promise<ClientSuggestionFromEntity[]> {
    return this.clientSuggestionService.findAll();
  }

  @Get('/byid/:id')
  findById(@Param('id') id: string): Promise<ClientSuggestionFromEntity> {
    return this.clientSuggestionService.findById(id);
  }

  @Get('/byname/:name')
  findByName(@Param('name') name: string): Promise<ClientSuggestionFromEntity[]> {
    return this.clientSuggestionService.findByNom(name);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Headers('access_token') access_token: string): Promise<ClientSuggestionFromEntity> {
    return this.clientSuggestionService.delete(id, access_token);
  }
}
