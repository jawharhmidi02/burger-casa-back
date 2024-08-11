import { Injectable } from '@nestjs/common';
import {
  And,
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
  Or,
  Raw,
  Repository,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Nourriture } from '../entities/nourriture.entity';
import { NourritureFromEntity } from 'src/dto/nourriture.dto';
import { NourritureToEntity } from 'src/dto/nourriture.dto';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/constants/jwt.constant';
import { Organisateur } from 'src/entities/organisateur.entity';

@Injectable()
export class NourritureService {
  constructor(
    @InjectRepository(Nourriture)
    private nourritureRepository: Repository<Nourriture>,
    private jwtService: JwtService,
    @InjectRepository(Organisateur)
    private organisateurRepository: Repository<Organisateur>,
  ) {}

  async create(
    nourriture: NourritureToEntity,
    access_token: string,
  ): Promise<NourritureFromEntity> {
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

      const response = await this.nourritureRepository.save(nourriture);
      const data = new NourritureFromEntity(response);
      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async findAll(): Promise<NourritureFromEntity[]> {
    try {
      const response = await this.nourritureRepository.find({
        relations: ['ingredients'],
      });

      const data = new Array<NourritureFromEntity>(response.length);

      for (let i = 0; i < response.length; i++) {
        data[i] = new NourritureFromEntity(response[i]);
      }

      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async findById(id: string): Promise<NourritureFromEntity> {
    try {
      const response = await this.nourritureRepository.findOne({
        where: { id },
        relations: ['ingredients'],
      });

      const data = new NourritureFromEntity(response);
      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async findByNom(nom: string): Promise<NourritureFromEntity[]> {
    try {
      const response = await this.nourritureRepository.find({
        where: { nom: Like(`%${nom}%`) },
        relations: ['ingredients'],
      });

      const data = new Array<NourritureFromEntity>(response.length);

      for (let i = 0; i < response.length; i++) {
        data[i] = new NourritureFromEntity(response[i]);
      }

      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async findByCategorie(categorie: string): Promise<NourritureFromEntity[]> {
    try {
      const response = await this.nourritureRepository.find({
        where: { categorie: Like(`%${categorie}%`) },
        relations: ['ingredients'],
      });

      const data = new Array<NourritureFromEntity>(response.length);

      for (let i = 0; i < response.length; i++) {
        data[i] = new NourritureFromEntity(response[i]);
      }

      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async searchNourriture(
    nom?: string,
    categorie?: string,
    minPrice?: number,
    maxPrice?: number,
    sortBy?: 'alphabetic' | 'price',
    sortDirection: 'ASC' | 'DESC' = 'ASC',
  ): Promise<NourritureFromEntity[]> {
    try {
      const whereConditions = [];

      if (nom) {
        whereConditions.push({
          nom: Raw((alias) => `LOWER(${alias}) ILIKE LOWER(:nom)`, {
            nom: `%${nom}%`,
          }),
        });
      }

      if (categorie) {
        const categoriesArray = categorie.split(' ');

        const conditions = categoriesArray.map((category) => `%${category}%`);

        whereConditions.push({
          categorie: Raw(
            (alias) =>
              `${conditions.map((_, i) => `LOWER(${alias}) ILIKE LOWER(:categorie${i})`).join(' OR ')}`,
            Object.fromEntries(
              conditions.map((condition, i) => [`categorie${i}`, condition]),
            ),
          ),
        });
      }

      if (minPrice !== undefined && maxPrice !== undefined) {
        whereConditions.push({
          prix: And(MoreThanOrEqual(minPrice), LessThanOrEqual(maxPrice)),
        });
      } else if (minPrice !== undefined) {
        whereConditions.push({ prix: MoreThanOrEqual(minPrice) });
      } else if (maxPrice !== undefined) {
        whereConditions.push({ prix: LessThanOrEqual(maxPrice) });
      }

      const order = {};
      if (sortBy) {
        order[sortBy === 'alphabetic' ? 'nom' : 'prix'] = sortDirection;
      }

      const response = await this.nourritureRepository.find({
        where: whereConditions.length > 0 ? whereConditions : undefined,
        relations: ['ingredients'],
        order,
      });

      const response1 = await this.nourritureRepository.find({
        where: { categorie: Or(Like(`%FD%`)) },
      });
      return response.map((item) => new NourritureFromEntity(item));
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async update(
    id: string,
    nourriture: NourritureToEntity,
    access_token: string,
  ): Promise<NourritureFromEntity> {
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

      if (nourriture.ingredients) {
        const search = await this.nourritureRepository.findOne({
          where: { id },
          relations: ['ingredients'],
        });
        Object.assign(search, nourriture);

        const response = await this.nourritureRepository.save(search);

        const data = new NourritureFromEntity(response);

        return data;
      }

      await this.nourritureRepository.update(id, nourriture);
      const response = await this.nourritureRepository.findOne({
        where: { id },
        relations: ['ingredients'],
      });

      const data = new NourritureFromEntity(response);

      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async delete(
    id: string,
    access_token: string,
  ): Promise<NourritureFromEntity> {
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

      const response = await this.nourritureRepository.findOne({
        where: { id },
        relations: ['ingredients'],
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
