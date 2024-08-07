import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CommandeFromEntity, CommandeToEntity } from 'src/dto/commande.dto';
import { CommandeService } from 'src/services/commande.service';

@Controller('commandes')
export class CommandeController {
  constructor(private readonly commandeService: CommandeService) {}

  @Post('/webhook')
  async webHook(@Body() body: any) {
    return this.commandeService.webHook(body);
  }

  @Post()
  async create(@Body() commande: CommandeToEntity) {
    try {
      const result = await this.commandeService.create(commande);
      return result;
    } catch (error) {
      console.error(error);
      return {
        status: 'error',
        message: error.message,
      };
    }
  }

  @Get()
  findAll(): Promise<CommandeFromEntity[]> {
    return this.commandeService.findAll();
  }

  @Get('/verify-order')
  async verifyOrder(@Query('token') token: string) {
    if (!token) {
      throw new BadRequestException('Token is required');
    }
    try {
      
      const commande = await this.commandeService.verifyToken(token);
      
      return commande;
    } catch (error) {
      throw new BadRequestException('Invalid or expired token');
    }
  }

  @Get('/cancel-order')
  async cancelOrder(@Query('token') token: string) {
    if (!token) {
      throw new BadRequestException('Token is required');
    }
    try {
      
      const commande = await this.commandeService.CancelOrder(token);

      return commande;
    } catch (error) {
      console.log(error);
      
      return error;
    }
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<CommandeFromEntity> {
    return this.commandeService.findById(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() commande: CommandeToEntity,
    @Headers('access_token') access_token: string,
    @Headers('whatsapp_api_key') whatsapp_api_key?: string,
  ): Promise<CommandeFromEntity> {
    return this.commandeService.update(id, commande, access_token, whatsapp_api_key);
  }

  @Delete(':id')
  delete(
    @Param('id') id: string,
    @Headers('access_token') access_token: string,
  ): Promise<CommandeFromEntity> {
    return this.commandeService.delete(id, access_token);
  }
}
