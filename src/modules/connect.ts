import * as dotenv from 'dotenv';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Ingredient } from '../entities/ingredient.entity';
import { Nourriture } from 'src/entities/nourriture.entity';
import { Organisateur } from 'src/entities/organisateur.entity';
import { IngredClientChoix } from 'src/entities/ingred_client_choix.entity';
import { ClientNourriture } from 'src/entities/client_nourriture.entity';
import { Commande } from "src/entities/commande.entity";

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
            entities: [Ingredient, Nourriture, Organisateur, IngredClientChoix, ClientNourriture, Commande],
            synchronize: true,
        })
    ]
})
export class ConnectModule{}