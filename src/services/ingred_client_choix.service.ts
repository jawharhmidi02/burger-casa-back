import { Injectable } from '@nestjs/common';
import { CreateIngredClientChoixDto } from '../dto/create-ingred_client_choix.dto';
import { UpdateIngredClientChoixDto } from '../dto/update-ingred_client_choix.dto';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { IngredClientChoix } from '../entities/ingred_client_choix.entity';

@Injectable()
export class IngredClientChoixService {
  constructor(
    @InjectRepository(IngredClientChoix)
    private Ingred_client_choixRepository: Repository<IngredClientChoix>
  ){}

  async create(ingred_client_choix: CreateIngredClientChoixDto): Promise<IngredClientChoix>{
    try {
      const data = new IngredClientChoix();
      Object.assign(data, ingred_client_choix);
      const response = await this.Ingred_client_choixRepository.save(data);
      
      return response;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async findAll(): Promise<IngredClientChoix[]>{
    try {
      const response = await this.Ingred_client_choixRepository.find();
      return response;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async findOne(id: string): Promise<IngredClientChoix>{
    try {
      const response = await this.Ingred_client_choixRepository.findOne({where: {id}})
    } catch (error) {

      console.log(error);
      return null;
    }
  }

  async update(id: string, updateIngredClientChoixDto: CreateIngredClientChoixDto): Promise<IngredClientChoix>{
    try {
      const data = new IngredClientChoix();
      Object.assign(data, updateIngredClientChoixDto);
      await this.Ingred_client_choixRepository.update(id, data);
      const response = await this.Ingred_client_choixRepository.findOne({where: {id}});

      return response;
    } catch (error) {
      console.log(error);
      return null
    }
  }

  async delete(id: string): Promise<IngredClientChoix>{
    try {
      const response = await this.Ingred_client_choixRepository.findOne({where: {id}});
      await this.Ingred_client_choixRepository.delete(id);
      return response;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

}