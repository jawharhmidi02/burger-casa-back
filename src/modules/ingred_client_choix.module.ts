import { Module } from '@nestjs/common';
import { IngredClientChoixService } from '../services/ingred_client_choix.service';
import { IngredClientChoixController } from '../controllers/ingred_client_choix.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngredClientChoix } from '../entities/ingred_client_choix.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IngredClientChoix])],
  controllers: [IngredClientChoixController],
  providers: [IngredClientChoixService],
})
export class IngredClientChoixModule {}
