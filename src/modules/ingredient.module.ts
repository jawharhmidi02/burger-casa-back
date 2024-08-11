import { Module } from '@nestjs/common';
import { IngredientService } from '../services/ingredient.service';
import { IngredientController } from '../controllers/ingredient.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ingredient } from '../entities/ingredient.entity';
import { Organisateur } from 'src/entities/organisateur.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ingredient, Organisateur])],
  controllers: [IngredientController],
  providers: [IngredientService],
})
export class IngredientModule {}
