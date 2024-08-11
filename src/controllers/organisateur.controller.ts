import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Headers,
  Query,
} from '@nestjs/common';
import { OrganisateurService } from '../services/organisateur.service';
import { OrganisateurToEntity } from 'src/dto/organisateur.dto';
import { OrganisateurFromEntity } from 'src/dto/organisateur.dto';

@Controller('organisateurs')
export class OrganisateurController {
  constructor(private readonly organisateurService: OrganisateurService) {}

  @Post('/signup/')
  create(
    @Body() organisateur: OrganisateurToEntity,
  ): Promise<OrganisateurFromEntity> {
    return this.organisateurService.signup(organisateur);
  }

  @Post('/signin/')
  findOne(
    @Body('email') email: string,
    @Body('password') password: string,
  ): Promise<{ access_token: string }> {
    return this.organisateurService.signin(email, password);
  }

  @Post('/recoverpassviaemail/:email')
  sendRecoverPassViaEmail(@Param('email') email: string): Promise<Boolean> {
    return this.organisateurService.sendRecoverPassViaEmail(email);
  }

  @Post('/recoverpassviawhatsapp/:email')
  sendRecoverPassViaWhatsapp(@Param('email') email: string): Promise<Boolean> {
    return this.organisateurService.sendRecoverPassViaWhatsapp(email);
  }

  @Post('/changepassfromrecover/:password')
  changePasswordFromRecover(
    @Query('token') token: string,
    @Param('password') password: string,
  ): Promise<OrganisateurFromEntity> {
    return this.organisateurService.changePasswordFromRecover(token, password);
  }

  @Get('/recoverhtml')
  getRecoverPassHtml(@Query('token') token: string): Promise<string> {
    return this.organisateurService.recoverPageHtml(token);
  }

  @Get()
  findAll(
    @Headers('access_token') access_token: string,
  ): Promise<OrganisateurFromEntity[]> {
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

  @Get('/account')
  getAccount(
    @Headers('access_token') access_token: string,
  ): Promise<OrganisateurFromEntity> {
    return this.organisateurService.getAccount(access_token);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() organisateur: OrganisateurToEntity,
    @Headers('access_token') access_token: string,
  ): Promise<OrganisateurFromEntity> {
    return this.organisateurService.update(id, organisateur, access_token);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Headers('access_token') access_token: string,
  ): Promise<OrganisateurFromEntity> {
    return this.organisateurService.remove(id, access_token);
  }
}
