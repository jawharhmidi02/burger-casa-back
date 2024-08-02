import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Commande } from "src/entities/commande.entity";
import { CommandeFromEntity, CommandeToEntity } from "src/dto/commande.dto";
import { jwtConstants } from "src/constants/jwt.constant";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class CommandeService{

    constructor(
        @InjectRepository(Commande)
        private commandeRepository: Repository<Commande>,
        private jwtService: JwtService
    ){}

    async create(commande: CommandeToEntity): Promise<CommandeFromEntity>{
        try {
            const response = await this.commandeRepository.save(commande);

            const data = new CommandeFromEntity(response);

            return data
        } catch (error) {
            console.log(error);
            
            return null;
        }
    }

    async findAll(): Promise<CommandeFromEntity[]>{
        try {
            const response = await this.commandeRepository.find({
                relations: ['client_nourriture']
            })

            const data = new Array<CommandeFromEntity>(response.length);

            for (let i = 0; i < response.length; i++) {
                data[i] = new CommandeFromEntity(response[i]);
                
            }

            return data;
        } catch (error) {
            console.log(error);
            
            return null;
        }
    }

    async findById(id: string): Promise<CommandeFromEntity>{
        try {
            const response = await this.commandeRepository.findOne({
                where: {id},
                relations: ['client_nourriture']
            })

            const data = new CommandeFromEntity(response);

            return data;
        } catch (error) {
            console.log(error);
            
            return null;
        }
    }

    async update(id: string, commande: CommandeToEntity, access_token: string): Promise<CommandeFromEntity>{
        try {
            const payLoad = await this.jwtService.verifyAsync(access_token,{ secret: jwtConstants.secret});

            await this.commandeRepository.update(id, commande);

            const response = await this.commandeRepository.findOne({where: {id}})

            const data = new CommandeFromEntity(response);

            return data;
        } catch (error) {
            console.log(error);
            
            return null;
        }
    }

    async delete(id: string, access_token: string): Promise<CommandeFromEntity>{
        try {
            const payLoad = await this.jwtService.verifyAsync(access_token,{ secret: jwtConstants.secret});

            const response = await this.commandeRepository.findOne({
                where: {id},
                relations: ['client_nourriture']
            })

            await this.commandeRepository.delete(id);

            const data = new CommandeFromEntity(response);

            return data;
        } catch (error) {
            console.log(error);
            
            return null;
        }
    }
}