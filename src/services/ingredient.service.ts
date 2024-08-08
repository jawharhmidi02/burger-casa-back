import { Injectable } from '@nestjs/common';
import { Ingredient } from '../entities/ingredient.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { IngredientFromEntity } from 'src/dto/ingredient.dto';
import { IngredientToEntity } from 'src/dto/ingredient.dto';
import { jwtConstants } from 'src/constants/jwt.constant';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class IngredientService {
  constructor(
    @InjectRepository(Ingredient)
    private ingredientRepository: Repository<Ingredient>,
    private jwtService: JwtService,
  ) {}

  async create(
    ingredient: IngredientToEntity,
    access_token: string,
  ): Promise<IngredientFromEntity> {
    try {
      const payLoad = await this.jwtService.verifyAsync(access_token, {
        secret: jwtConstants.secret,
      });

      if (payLoad.dialogues == undefined) {
        return null;
      }

      const response = await this.ingredientRepository.save(ingredient);

      const data = new IngredientFromEntity(response);

      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async findAll(): Promise<IngredientFromEntity[]> {
    try {
      const response = await this.ingredientRepository.find();

      const data = new Array<IngredientFromEntity>(response.length);

      for (let i = 0; i < response.length; i++) {
        data[i] = new IngredientFromEntity(response[i]);
      }

      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async findById(id: string): Promise<IngredientFromEntity> {
    try {
      const response = await this.ingredientRepository.findOne({
        where: { id },
      });

      const data = new IngredientFromEntity(response);

      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async findByNom(nom: string): Promise<IngredientFromEntity[]> {
    try {
      const response = await this.ingredientRepository.find({
        where: { nom: Like(`%${nom}%`) },
      });

      const data = new Array<IngredientFromEntity>(response.length);

      for (let i = 0; i < response.length; i++) {
        data[i] = new IngredientFromEntity(response[i]);
      }

      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async update(
    id: string,
    ingredient: IngredientToEntity,
    access_token: string,
  ): Promise<IngredientFromEntity> {
    try {
      const payLoad = await this.jwtService.verifyAsync(access_token, {
        secret: jwtConstants.secret,
      });

      if (payLoad.dialogues == undefined) {
        return null;
      }

      await this.ingredientRepository.update(id, ingredient);

      const response = await this.ingredientRepository.findOne({
        where: { id },
      });

      const data = new IngredientFromEntity(response);

      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async delete(
    id: string,
    access_token: string,
  ): Promise<IngredientFromEntity> {
    try {
      const payLoad = await this.jwtService.verifyAsync(access_token, {
        secret: jwtConstants.secret,
      });

      if (payLoad.dialogues == undefined) {
        return null;
      }

      const response = await this.ingredientRepository.findOne({
        where: { id },
      });
      await this.ingredientRepository.delete(id);

      const data = new IngredientFromEntity(response);

      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
