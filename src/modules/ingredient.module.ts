import { Module } from '@nestjs/common';
import { IngredientService } from '../services/ingredient.service';
import { IngredientController } from '../controllers/ingredient.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ingredient } from '../entities/ingredient.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ingredient])],
  controllers: [IngredientController],
  providers: [IngredientService],
})
export class IngredientModule {}
