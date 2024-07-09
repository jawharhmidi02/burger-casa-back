import * as dotenv from 'dotenv';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Nourriture } from '../entities/nourriture';
import { Ingredient } from '../entities/ingredient';
import { Organisateur } from '../entities/organisateur';
import { Module } from '@nestjs/common';
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
        })
    ]
})
export class ConnectModule{}