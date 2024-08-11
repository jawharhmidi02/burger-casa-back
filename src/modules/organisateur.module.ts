import { Module } from '@nestjs/common';
import { OrganisateurService } from '../services/organisateur.service';
import { OrganisateurController } from '../controllers/organisateur.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organisateur } from '../entities/organisateur.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/constants/jwt.constant';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([Organisateur]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '7d' },
    }),
    HttpModule
  ],
  controllers: [OrganisateurController],
  providers: [OrganisateurService],
})
export class OrganisateurModule {}
