import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ClientNourriture } from "src/entities/client_nourriture.entity";
import { ClientNourritureFromEntity, ClientNourritureToEntity } from "src/dto/client_nourriture.dto";

@Injectable()
export class ClientNourritureService{
    constructor(
        @InjectRepository(ClientNourriture)
        private ClientNourritureRepository: Repository<ClientNourriture>
    ){}

    async create(clientNourriture: ClientNourritureToEntity): Promise<ClientNourritureFromEntity>{
        try {
            const response = await this.ClientNourritureRepository.save(clientNourriture);

            const data = new ClientNourritureFromEntity(response);

            return data;
        } catch (error) {
            console.log(error);
            
            return null;
        }
    }

    async findAll(): Promise<ClientNourritureFromEntity[]>{
        try {
            const response = await this.ClientNourritureRepository.find({
                relations: ['ingred_client_choix', 'id_nourriture']
            });

            const data = new Array<ClientNourritureFromEntity>(response.length);

            for (let i = 0; i < response.length; i++) {
                data[i] = new ClientNourritureFromEntity(response[i]);
            }

            return data
        } catch (error) {
            console.log(error);
            
            return null;
        }
    }

    async findById(id: string): Promise<ClientNourritureFromEntity>{
        try {
            const response = await this.ClientNourritureRepository.findOne({
                where: {id},
                relations: ['id_nourriture', 'ingred_client_choix']
            })

            const data = new ClientNourritureFromEntity(response);

            return data;
        } catch (error) {
            console.log(error);
            
            return null;
        }
    }

    async update(id: string, clientNourriture: ClientNourritureToEntity): Promise<ClientNourritureFromEntity>{
        try {
            if(clientNourriture.ingred_client_choix){
                const search = await this.ClientNourritureRepository.findOne({
                    where: {id},
                    relations: ['id_nourriture', 'ingred_client_choix']
                });

                Object.assign(search, clientNourriture);

                await this.ClientNourritureRepository.save(search);
            }else{
                await this.ClientNourritureRepository.update(id, clientNourriture);
            }
            const response = await this.ClientNourritureRepository.findOne({
                where: {id},
                relations: ['id_nourriture', 'ingred_client_choix']
            });

            const data = new ClientNourritureFromEntity(response);

            return data;
        } catch (error) {
            console.log(error);
            
            return null;
        }
    }

    async delete(id: string): Promise<ClientNourritureFromEntity>{
        try {
            const response = await this.ClientNourritureRepository.findOne({
                where: {id},
                relations: ['id_nourriture', 'ingred_client_choix']
            });
            
            await this.ClientNourritureRepository.delete(id);

            const data = new ClientNourritureFromEntity(response);

            return data;
        } catch (error) {
            console.log(error);
            
            return null;
        }
    }
}