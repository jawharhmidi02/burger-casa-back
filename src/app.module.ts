import { Module } from '@nestjs/common';
import { ConnectModule } from 'src/modules/connect';
import { IngredientModule } from './modules/ingredient.module';
import { NourritureModule } from './modules/nourriture.module';
import { OrganisateurModule } from './modules/organisateur.module';
import { CommandeModule } from './modules/commande.module';
import { ClientSuggestionModule } from './modules/client_suggestion.module';
import { WhatsappMessageModule } from './modules/whatsapp_message.module';
import { WebHookModule } from './modules/webhook.module';

@Module({
  imports: [
    ConnectModule,
    IngredientModule,
    NourritureModule,
    OrganisateurModule,
    CommandeModule,
    ClientSuggestionModule,
    WhatsappMessageModule,
    WebHookModule
  ],
})
export class AppModule {
  
}
