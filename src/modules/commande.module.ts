import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommandeController } from "src/controllers/commande.controller";
import { Commande } from "src/entities/commande.entity";
import { CommandeService } from "src/services/commande.service";

@Module({
    imports: [TypeOrmModule.forFeature([Commande])],
    providers: [CommandeService],
    controllers: [CommandeController]
})
export class CommandeModule{}