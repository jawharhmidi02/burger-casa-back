import { Body, Controller, Post, Get, Param, Patch, Delete, Put } from "@nestjs/common";
import { ClientNourritureFromEntity, ClientNourritureToEntity } from "src/dto/client_nourriture.dto";
import { ClientNourritureService } from "src/services/client_nourriture.service";

@Controller('client_nourritures')
export class ClientNourritureController{
    
    constructor(private readonly ClientNourriture: ClientNourritureService){}

    @Post()
    create(@Body() clientNourriture: ClientNourritureToEntity): Promise<ClientNourritureFromEntity>{
        return this.ClientNourriture.create(clientNourriture);
    }

    @Get()
    findAll(): Promise<ClientNourritureFromEntity[]>{
        return this.ClientNourriture.findAll();
    }

    @Get(':id')
    findById(@Param('id') id: string): Promise<ClientNourritureFromEntity>{
        return this.ClientNourriture.findById(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() clientNourriture: ClientNourritureToEntity): Promise<ClientNourritureFromEntity>{
        return this.ClientNourriture.update(id, clientNourriture);
    }

    @Delete(':id')
    delete(@Param('id') id: string): Promise<ClientNourritureFromEntity>{
        return this.ClientNourriture.delete(id);
    }

}