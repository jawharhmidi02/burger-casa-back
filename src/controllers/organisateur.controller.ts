import { Controller, Get, Post, Body, Put, Param, Delete, Header, Headers } from '@nestjs/common';
import { OrganisateurService } from '../services/organisateur.service';
import { OrganisateurToEntity } from 'src/dto/organisateur.dto';
import { OrganisateurFromEntity } from 'src/dto/organisateur.dto';

@Controller('organisateurs')
export class OrganisateurController {
  constructor(private readonly organisateurService: OrganisateurService) {}

  @Post('/signup/')
  create(@Body() organisateur: OrganisateurToEntity): Promise<OrganisateurFromEntity> {
    return this.organisateurService.signup(organisateur);
  }

  @Get()
  findAll(@Headers('access_token') access_token: string): Promise<OrganisateurFromEntity[]> {
    return this.organisateurService.findAll(access_token);
  }

  @Get('/byemail/:email')
  verifyEmail(@Param('email') email: string): Promise<Boolean> {
    return this.organisateurService.verifyEmail(email);
  }

  @Get('/byid/:id')
  findById(@Param('id') id: string): Promise<OrganisateurFromEntity> {
    return this.organisateurService.findById(id);
  }

  @Post('/signin/')
  findOne(@Body('email') email: string, @Body('password') password: string): Promise<{access_token: string}> {
    return this.organisateurService.signin(email, password);
  }

  @Put(':email&:password')
  update(@Param('email') email: string, @Param('password') password: string, @Body() organisateur: OrganisateurToEntity, @Headers('access_token') access_token: string): Promise<OrganisateurFromEntity> {
    return this.organisateurService.update(email, password, organisateur, access_token);
  }

  @Delete(':id')
  remove(@Param('email') email: string, @Param('password') password: string, @Headers('access_token') access_token: string): Promise<OrganisateurFromEntity> {
    return this.organisateurService.remove(email, password, access_token);
  }
}
