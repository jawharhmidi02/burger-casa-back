import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NourritureController } from "src/controllers/nourriture";
import { Nourriture } from "src/entities/nourriture";
import { NourritureService } from "src/services/nourriture";

@Module({
    imports: [TypeOrmModule.forFeature([Nourriture])],
    providers: [NourritureService],
    controllers: [NourritureController],
    exports: [NourritureService]
})
export class NourritureModule{}