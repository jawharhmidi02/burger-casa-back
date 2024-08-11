import {
  Controller,
  Get,
  Post,
  Body,
  Headers,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { SupplimentService } from '../services/suppliment.service';
import { SupplimentFromEntity } from 'src/dto/suppliment.dto';
import { SupplimentToEntity } from 'src/dto/suppliment.dto';

@Controller('suppliments')
export class SupplimentController {
  constructor(private readonly ingredientService: SupplimentService) {}

  @Post()
  create(
    @Body() ingredient: SupplimentToEntity,
    @Headers('access_token') access_token: string,
  ): Promise<SupplimentFromEntity> {
    return this.ingredientService.create(ingredient, access_token);
  }

  @Get()
  findAll(): Promise<SupplimentFromEntity[]> {
    return this.ingredientService.findAll();
  }

  @Get('/byid/:id')
  findById(@Param('id') id: string): Promise<SupplimentFromEntity> {
    return this.ingredientService.findById(id);
  }

  @Get('/byname/:name')
  findByName(@Param('name') name: string): Promise<SupplimentFromEntity[]> {
    return this.ingredientService.findByNom(name);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() ingredient: SupplimentFromEntity,
    @Headers('access_token') access_token: string,
  ): Promise<SupplimentFromEntity> {
    return this.ingredientService.update(id, ingredient, access_token);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Headers('access_token') access_token: string,
  ): Promise<SupplimentFromEntity> {
    return this.ingredientService.delete(id, access_token);
  }
}
