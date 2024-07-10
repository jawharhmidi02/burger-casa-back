import { Injectable } from '@nestjs/common';
import { CreateNourritureDto } from '../dto/create-nourriture.dto';
import { UpdateNourritureDto } from '../dto/update-nourriture.dto';
import { Like, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Nourriture } from "../entities/nourriture.entity";

@Injectable()
export class NourritureService {

  constructor(
      @InjectRepository(Nourriture)
      private nourritureRepository: Repository<Nourriture>
  ){}
  
  async create(nourriture: CreateNourritureDto): Promise<Nourriture>{
      try {
        const data = new Nourriture();
        Object.assign(data, nourriture)
        const response = await this.nourritureRepository.save(data);
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

  async update(id: string, nourriture: UpdateNourritureDto): Promise<Nourriture>{
    const data = new Nourriture();
    Object.assign(data, nourriture)
    
    try {
      if(nourriture.ingredients && nourriture.ingredients.length != 0){

        const response = await this.nourritureRepository.findOne({ 
          where: { id },
          relations: ["ingredients"]
        })
        Object.assign(response, data);
        return await this.nourritureRepository.save(response);
      }

      await this.nourritureRepository.update(id, data);
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