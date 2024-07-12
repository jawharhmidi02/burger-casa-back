import { Body, Controller, Delete, Get, Headers, Param, Post, Put } from "@nestjs/common";
import { CommandeFromEntity, CommandeToEntity } from "src/dto/commande.dto";
import { CommandeService } from "src/services/commande.service";

@Controller('commandes')
export class CommandeController{
    constructor(private readonly commandeService: CommandeService){}

    @Post()
    create(@Body() commande: CommandeToEntity): Promise<CommandeFromEntity>{
        return this.commandeService.create(commande);
    }

    @Get()
    findAll(): Promise<CommandeFromEntity[]>{
        return this.commandeService.findAll();
    }

    @Get(':id')
    findById(@Param('id') id: string): Promise<CommandeFromEntity>{
        return this.commandeService.findById(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() commande: CommandeToEntity, @Headers('access_token') access_token: string): Promise<CommandeFromEntity>{
        return this.commandeService.update(id, commande, access_token);
    }

    @Delete(':id')
    delete(@Param('id') id: string, @Headers('access_token') access_token: string): Promise<CommandeFromEntity>{
        return this.commandeService.delete(id, access_token);
    }
}