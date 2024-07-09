import { Like, Repository } from "typeorm";
import { Nourriture } from "src/entities/nourriture";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class NourritureService {

    constructor(
        @InjectRepository(Nourriture)
        private nourritureRepository: Repository<Nourriture>
    ){}
    
    async create(nourriture: Nourriture): Promise<Nourriture>{
        try {
            const response = await this.nourritureRepository.save(nourriture);
            return response;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async findAll(): Promise<Nourriture[]>{
        try{
            const response = await this.nourritureRepository.find({
                relations: ['ingredients']
            });
            return response;
        }
        catch(error){
            console.log(error);
            return null;
        }
    }

    async findById(id: string): Promise<Nourriture>{
        try {
            const response = await this.nourritureRepository.findOne({ 
                where: { id },
                relations: ["ingredients"]
            })
            return response;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async findByNom(nom: string): Promise<Nourriture[]>{
        try {
            const response = await this.nourritureRepository.find( { 
                where: { nom: Like(`%${nom}%`) },
                relations: ["ingredients"]
             } )
            return response;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    
    async findByCategorie(categorie: string): Promise<Nourriture[]>{
        try {
            const response = await this.nourritureRepository.find( { 
                where: { categorie: Like(`%${categorie}%`) },
                relations: ["ingredients"]
            } )
            return response;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async update(id: string, nourriture: Nourriture): Promise<Nourriture>{
        try {
            if(nourriture.ingredients && nourriture.ingredients.length != 0){
                const response = await this.nourritureRepository.findOne({ 
                    where: { id },
                    relations: ["ingredients"]
                })
                Object.assign(response, nourriture);
                return await this.nourritureRepository.save(response);
            }

            await this.nourritureRepository.update(id, nourriture);
            const response = await this.nourritureRepository.findOne({
                where: { id },
                relations: ["ingredients"]
            })
            return response;

        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async delete(id: string): Promise<Nourriture>{
        try {
            const response = await this.nourritureRepository.findOne({
                where: { id },
                relations: ["ingredients"]
            });
            await this.nourritureRepository.delete(id);

            return response;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    
}