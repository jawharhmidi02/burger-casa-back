import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ingredient } from '../entities/ingredient';
import { IngredientService } from '../services/ingredient';
import { IngredientController } from '../controllers/ingredient';

@Module({
  imports: [TypeOrmModule.forFeature([Ingredient])],
  providers: [IngredientService],
  controllers: [IngredientController],
  exports: [IngredientService],
})
export class IngredientModule {}
