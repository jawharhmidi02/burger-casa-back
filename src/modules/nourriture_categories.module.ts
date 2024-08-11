import { NourritureCategorieController } from './../controllers/nourriture_categories.controller';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConstants } from 'src/constants/jwt.constant';
import { NourritureCategorie } from 'src/entities/nourriture_categories.entity';
import { Organisateur } from 'src/entities/organisateur.entity';
import { NourritureCategorieService } from 'src/services/nourriture_categories.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([NourritureCategorie, Organisateur]),
    JwtModule.register({ secret: jwtConstants.secret, global: true }),
  ],
  providers: [NourritureCategorieService],
  controllers: [NourritureCategorieController],
})
export class NourritureCategorieModule {}
