import { Module } from "@nestjs/common";
import { ClientNourriture } from "src/entities/client_nourriture.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClientNourritureService } from "src/services/client_nourriture.service";
import { ClientNourritureController } from 'src/controllers/client_nourriture.contoller';

@Module({
    imports: [TypeOrmModule.forFeature([ClientNourriture])],
    providers: [ClientNourritureService],
    controllers: [ClientNourritureController]
})
export class ClientNourritureModule{}