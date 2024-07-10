import { Module } from '@nestjs/common';
import { ConnectModule } from 'src/modules/connect';
import { IngredientModule } from './modules/ingredient.module';
import { NourritureModule } from './modules/nourriture.module';
import { OrganisateurModule } from './modules/organisateur.module';
import { IngredClientChoixModule } from './modules/ingred_client_choix.module';

@Module({
  imports: [
    IngredClientChoixModule,
    ConnectModule,
    IngredientModule,
    NourritureModule,
    OrganisateurModule,
  ],
})
export class AppModule {
  
}
