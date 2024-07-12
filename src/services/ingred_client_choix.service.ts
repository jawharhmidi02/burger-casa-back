import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { IngredClientChoix } from '../entities/ingred_client_choix.entity';
import { IngredClientChoixFromEntity } from 'src/dto/ingred_client_choix.dto';
import { IngredClientChoixToEntity } from 'src/dto/ingred_client_choix.dto';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/constants/jwt.constant';

@Injectable()
export class IngredClientChoixService {
  constructor(
    @InjectRepository(IngredClientChoix)
    private Ingred_client_choixRepository: Repository<IngredClientChoix>
  ){}

  async create(ingredClientChoix: IngredClientChoixToEntity): Promise<IngredClientChoixFromEntity>{
    try {
      const response = await this.Ingred_client_choixRepository.save(ingredClientChoix);

      const data = new IngredClientChoixFromEntity(response);
      
      return data;
    } catch (error) {
      console.log(error);

      return null;
    }
  }

  async findAll(): Promise<IngredClientChoixFromEntity[]>{
    try {
      const response = await this.Ingred_client_choixRepository.find({
        relations: ['id_ingredient']
      });

      const data = new Array<IngredClientChoixFromEntity>(response.length);

      for (let i = 0; i < response.length; i++) {
        data[i] = new IngredClientChoixFromEntity(response[i]);
      }

      return response;
    } catch (error) {
      console.log(error);

      return null;
    }
  }

  async findOne(id: string): Promise<IngredClientChoixFromEntity>{
    try {
      const response = await this.Ingred_client_choixRepository.findOne({
        where: {id},
        relations: ['id_ingredient']  
      });

      const data = new IngredClientChoixFromEntity(response);
      
      return data;
    } catch (error) {
      console.log(error);

      return null;
    }
  }

  async update(id: string, ingredClientChoix: IngredClientChoixToEntity): Promise<IngredClientChoixFromEntity>{
    try {
      await this.Ingred_client_choixRepository.update(id, ingredClientChoix);

      const response = await this.Ingred_client_choixRepository.findOne({
        where: {id},
        relations: ['id_ingredient']  
      });

      const data = new IngredClientChoixFromEntity(response);
      
      return data;
    } catch (error) {
      console.log(error);
      
      return null
    }
  }

  async delete(id: string): Promise<IngredClientChoixFromEntity>{
    try {
      const response = await this.Ingred_client_choixRepository.findOne({
        where: {id},
        relations: ['id_ingredient']  
      });

      await this.Ingred_client_choixRepository.delete(id);

      const data = new IngredClientChoixFromEntity(response);
      
      return data;
    } catch (error) {
      console.log(error);

      return null;
    }
  }

}