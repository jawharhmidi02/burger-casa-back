import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganisateurModule } from './modules/organisateur';
import { Organisateur } from './entities/organisateur';
import { Ingredient } from './entities/ingredient';
import { IngredientModule } from './modules/ingredient';
import * as dotenv from 'dotenv';
import { NourritureModule } from './modules/nourriture';
import { Nourriture } from './entities/nourriture';

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
      entities: [Organisateur, Ingredient, Nourriture],
      synchronize: true,
    }),
    OrganisateurModule,
    IngredientModule,
    NourritureModule
  ],
})
export class AppModule {}
