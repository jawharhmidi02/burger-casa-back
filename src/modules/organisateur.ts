import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organisateur } from '../entities/organisateur';
import { OrganisateurService } from '../services/organisateur';
import { OrganisateurController } from '../controllers/organisateur';

@Module({
  imports: [TypeOrmModule.forFeature([Organisateur])],
  providers: [OrganisateurService],
  controllers: [OrganisateurController],
  exports: [OrganisateurService],
})
export class OrganisateurModule {}
