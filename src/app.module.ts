import { Module } from '@nestjs/common';
import { ConnectModule } from 'src/modules/connect';
import { IngredientModule } from './modules/ingredient.module';
import { NourritureModule } from './modules/nourriture.module';
import { OrganisateurModule } from './modules/organisateur.module';
import { CommandeModule } from './modules/commande.module';

@Module({
  imports: [
    ConnectModule,
    IngredientModule,
    NourritureModule,
    OrganisateurModule,
    CommandeModule
  ],
})
export class AppModule {
  
}
