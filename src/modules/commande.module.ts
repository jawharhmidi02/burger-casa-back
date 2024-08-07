import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConstants } from 'src/constants/jwt.constant';
import { CommandeController } from 'src/controllers/commande.controller';
import { Commande } from 'src/entities/commande.entity';
import { WhatsappMessage } from 'src/entities/whatsapp_message.entity';
import { CommandeService } from 'src/services/commande.service';
import { WhatsappMessageModule } from './whatsapp_message.module';
import { WhatsappMessageService } from 'src/services/whatsapp_message.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Commande, WhatsappMessage]),
    HttpModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '12h' },
    }),
  ],
  providers: [CommandeService, WhatsappMessageService],
  controllers: [CommandeController],
})
export class CommandeModule {}
