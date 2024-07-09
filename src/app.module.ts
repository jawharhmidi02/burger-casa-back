import { Module } from '@nestjs/common';
import { OrganisateurModule } from './modules/organisateur';
import { IngredientModule } from './modules/ingredient';
import { NourritureModule } from './modules/nourriture';
import { ConnectModule } from 'src/modules/connect';

@Module({
  imports: [
    ConnectModule,
    OrganisateurModule,
    IngredientModule,
    NourritureModule
  ],
})
export class AppModule {}
