import { Module } from '@nestjs/common';
import { SupplimentService } from '../services/suppliment.service';
import { SupplimentController } from '../controllers/suppliment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Suppliment } from '../entities/suppliment.entity';
import { Organisateur } from 'src/entities/organisateur.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Suppliment, Organisateur])],
  controllers: [SupplimentController],
  providers: [SupplimentService],
})
export class SupplimentModule {}
