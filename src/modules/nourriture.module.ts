import { Module } from '@nestjs/common';
import { NourritureService } from '../services/nourriture.service';
import { NourritureController } from '../controllers/nourriture.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Nourriture } from '../entities/nourriture.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Nourriture])],
  controllers: [NourritureController],
  providers: [NourritureService],
})
export class NourritureModule {}
