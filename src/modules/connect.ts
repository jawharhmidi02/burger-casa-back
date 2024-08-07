import * as dotenv from 'dotenv';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Ingredient } from '../entities/ingredient.entity';
import { Nourriture } from 'src/entities/nourriture.entity';
import { Organisateur } from 'src/entities/organisateur.entity';
import { Commande } from "src/entities/commande.entity";
import { ClientSuggestion } from 'src/entities/client_suggestion.entity';
import { WhatsappMessage } from 'src/entities/whatsapp_message.entity';

dotenv.config();

const {
  SUPABASE_HOST, SUPABASE_PORT, SUPABASE_USERNAME, SUPABASE_PASSWORD, SUPABASE_DATABASE
} = process.env;


@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: SUPABASE_HOST,
            port: parseInt(SUPABASE_PORT, 10),
            username: SUPABASE_USERNAME,
            password: SUPABASE_PASSWORD,
            database: SUPABASE_DATABASE,
            entities: [Ingredient, Nourriture, Organisateur, Commande, ClientSuggestion, WhatsappMessage],
            synchronize: true,
        })
    ]
})
export class ConnectModule{}