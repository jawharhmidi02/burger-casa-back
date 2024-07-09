import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganisateurModule } from './modules/organisateur';
import { Organisateur } from './entities/organisateur';
import { Ingredient } from './entities/ingredient';
import { IngredientModule } from './modules/ingredient';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'foufouloulou',
      database: 'restaurant',
      entities: [Organisateur, Ingredient],
      synchronize: true,
    }),
    OrganisateurModule,
    IngredientModule
  ],
})
export class AppModule {}
