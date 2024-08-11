import { JwtService } from '@nestjs/jwt';
import { NourritureCategorie } from './../entities/nourriture_categories.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import {
  NourritureCategorieFromEntity,
  NourritureCategorieToEntity,
} from 'src/dto/nourriture_categories.dto';
import { jwtConstants } from 'src/constants/jwt.constant';
import { Organisateur } from 'src/entities/organisateur.entity';

@Injectable()
export class NourritureCategorieService {
  constructor(
    @InjectRepository(NourritureCategorie)
    private nourritureCategorieRepository: Repository<NourritureCategorie>,
    private jwtService: JwtService,
    @InjectRepository(Organisateur)
    private organisateurRepository: Repository<Organisateur>,
  ) {}

  async create(
    access_token: string,
    nourritureCategorie: NourritureCategorieToEntity,
  ): Promise<NourritureCategorieFromEntity> {
    try {
      const payLoad = await this.jwtService.verifyAsync(access_token, {
        secret: jwtConstants.secret,
      });

      if (payLoad.role == undefined) {
        return null;
      }

      const account = await this.organisateurRepository.findOne({
        where: { id: payLoad.id },
      });

      if (!account || account.nonce != payLoad.nonce) {
        return null;
      }

      const response =
        await this.nourritureCategorieRepository.save(nourritureCategorie);

      const data = new NourritureCategorieFromEntity(response);

      return data;
    } catch (error) {
      console.log(error);

      return null;
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 1,
  ): Promise<any> {
    try {
      const [response, totalItems] =
        await this.nourritureCategorieRepository.findAndCount({
          skip: (page - 1) * limit,
          take: limit,
        });

      const data = response.map(
        (item) => new NourritureCategorieFromEntity(item),
      );

      return {
        data,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async findById(id: string): Promise<NourritureCategorieFromEntity> {
    try {
      const response = await this.nourritureCategorieRepository.findOne({
        where: { id },
      });

      const data = new NourritureCategorieFromEntity(response);

      return data;
    } catch (error) {
      console.log(error);

      return null;
    }
  }

  async findByName(name: string): Promise<NourritureCategorieFromEntity[]> {
    try {
      const response = await this.nourritureCategorieRepository.find({
        where: { nom: Like(`%${name}%`) },
      });

      const data = response.map(
        (item) => new NourritureCategorieFromEntity(item),
      );

      return data;
    } catch (error) {
      console.log(error);

      return null;
    }
  }

  async update(
    access_token: string,
    id: string,
    nourritureCategorie: NourritureCategorieToEntity,
  ): Promise<NourritureCategorieFromEntity> {
    try {
      const payLoad = await this.jwtService.verifyAsync(access_token, {
        secret: jwtConstants.secret,
      });

      if (payLoad.role != 'admin') {
        return null;
      }

      const account = await this.organisateurRepository.findOne({
        where: { id: payLoad.id },
      });

      if (!account || account.nonce != payLoad.nonce) {
        return null;
      }

      await this.nourritureCategorieRepository.update(
        { id },
        nourritureCategorie,
      );

      const response = await this.nourritureCategorieRepository.findOne({
        where: { id },
      });

      const data = new NourritureCategorieFromEntity(response);

      return data;
    } catch (error) {
      console.log(error);

      return null;
    }
  }

  async delete(
    access_token: string,
    id: string,
  ): Promise<NourritureCategorieFromEntity> {
    try {
      const payLoad = await this.jwtService.verifyAsync(access_token, {
        secret: jwtConstants.secret,
      });

      if (payLoad.role != 'admin') {
        return null;
      }

      const account = await this.organisateurRepository.findOne({
        where: { id: payLoad.id },
      });

      if (!account || account.nonce != payLoad.nonce) {
        return null;
      }

      const response = await this.nourritureCategorieRepository.findOne({
        where: { id },
      });

      await this.nourritureCategorieRepository.delete(id);

      const data = new NourritureCategorieFromEntity(response);

      return data;
    } catch (error) {
      console.log(error);

      return null;
    }
  }
}
