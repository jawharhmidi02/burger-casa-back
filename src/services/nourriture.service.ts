import { Injectable } from '@nestjs/common';
import { Like, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Nourriture } from "../entities/nourriture.entity";
import { NourritureFromEntity } from 'src/dto/nourriture.dto';
import { NourritureToEntity } from 'src/dto/nourriture.dto';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/constants/jwt.constant';

@Injectable()
export class NourritureService {

    constructor(
        @InjectRepository(Nourriture)
        private nourritureRepository: Repository<Nourriture>,
        private jwtService: JwtService
    ){}
  
    async create(nourriture: NourritureToEntity, access_token: string): Promise<NourritureFromEntity>{
        try {
            const payLoad = await this.jwtService.verifyAsync(access_token,{ secret: jwtConstants.secret});

            const response = await this.nourritureRepository.save(nourriture);
            const data = new NourritureFromEntity(response);
            return data;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async findAll(): Promise<NourritureFromEntity[]>{
        try{
            const response = await this.nourritureRepository.find({
                relations: ['ingredients']
            });

            const data = new Array<NourritureFromEntity>(response.length)

            for (let i = 0; i < response.length; i++) {
                data[i] = new NourritureFromEntity(response[i]);
                
            }

            return data;
        }
        catch(error){
            console.log(error);
            return null;
        }
    }

    async findById(id: string): Promise<NourritureFromEntity>{
        try {
            const response = await this.nourritureRepository.findOne({ 
                where: { id },
                relations: ["ingredients"]
            })
            
            const data = new NourritureFromEntity(response);
            return data;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async findByNom(nom: string): Promise<NourritureFromEntity[]>{
        try {
            const response = await this.nourritureRepository.find( { 
                where: { nom: Like(`%${nom}%`) },
                relations: ["ingredients"]
            })
            
            const data = new Array<NourritureFromEntity>(response.length)

            for (let i = 0; i < response.length; i++) {
                data[i] = new NourritureFromEntity(response[i]);
                
            }

            return data;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
  
    async findByCategorie(categorie: string): Promise<NourritureFromEntity[]>{
        try {
            const response = await this.nourritureRepository.find( { 
                where: { categorie: Like(`%${categorie}%`) },
                relations: ["ingredients"]
            } )

            const data = new Array<NourritureFromEntity>(response.length)

            for (let i = 0; i < response.length; i++) {
                data[i] = new NourritureFromEntity(response[i]);
                
            }

            return data;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async update(id: string, nourriture: NourritureToEntity, access_token: string): Promise<NourritureFromEntity>{
        
        try {
            const payLoad = await this.jwtService.verifyAsync(access_token,{ secret: jwtConstants.secret});

            if(nourriture.ingredients){
                const search = await this.nourritureRepository.findOne({ 
                    where: { id },
                    relations: ["ingredients"]
                })
                Object.assign(search, nourriture);

                const response =  await this.nourritureRepository.save(search);

                const data = new NourritureFromEntity(response);

                return data;
            }

            await this.nourritureRepository.update(id, nourriture);
            const response = await this.nourritureRepository.findOne({
                where: { id },
                relations: ["ingredients"]
            })

            const data = new NourritureFromEntity(response);

            return data;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async delete(id: string, access_token: string): Promise<NourritureFromEntity>{
        try {
            const payLoad = await this.jwtService.verifyAsync(access_token,{ secret: jwtConstants.secret});

            const response = await this.nourritureRepository.findOne({
                where: { id },
                relations: ["ingredients"]
            });
            
            await this.nourritureRepository.delete(id);
            const data = new NourritureFromEntity(response);

            return data;
        } catch (error) {
            console.log(error);
            return null;
        }
    } 
}