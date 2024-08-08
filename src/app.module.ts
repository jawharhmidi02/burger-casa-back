import { Module } from '@nestjs/common';
import { ConnectModule } from 'src/modules/connect';
import { IngredientModule } from './modules/ingredient.module';
import { NourritureModule } from './modules/nourriture.module';
import { OrganisateurModule } from './modules/organisateur.module';
import { CommandeModule } from './modules/commande.module';
import { ClientSuggestionModule } from './modules/client_suggestion.module';
import { WhatsappMessageModule } from './modules/whatsapp_message.module';
import { WebHookModule } from './modules/webhook.module';
import { PingModule } from './modules/ping_database.module';
import { EmailSubscriptionModule } from './modules/email_subscription.module';

@Module({
  imports: [
    ConnectModule,
    IngredientModule,
    NourritureModule,
    OrganisateurModule,
    CommandeModule,
    ClientSuggestionModule,
    WhatsappMessageModule,
    WebHookModule,
    PingModule,
    EmailSubscriptionModule
  ],
})
export class AppModule {
  
}
