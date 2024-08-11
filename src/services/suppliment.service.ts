import { Injectable } from '@nestjs/common';
import { Suppliment } from '../entities/suppliment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { SupplimentFromEntity } from 'src/dto/suppliment.dto';
import { SupplimentToEntity } from 'src/dto/suppliment.dto';
import { jwtConstants } from 'src/constants/jwt.constant';
import { JwtService } from '@nestjs/jwt';
import { Organisateur } from 'src/entities/organisateur.entity';

@Injectable()
export class SupplimentService {
  constructor(
    @InjectRepository(Suppliment)
    private supplimentRepository: Repository<Suppliment>,
    private jwtService: JwtService,
    @InjectRepository(Organisateur)
    private organisateurRepository: Repository<Organisateur>,
  ) {}

  async create(
    ingredient: SupplimentToEntity,
    access_token: string,
  ): Promise<SupplimentFromEntity> {
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

      const response = await this.supplimentRepository.save(ingredient);

      const data = new SupplimentFromEntity(response);

      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async findAll(): Promise<SupplimentFromEntity[]> {
    try {
      const response = await this.supplimentRepository.find();

      const data = new Array<SupplimentFromEntity>(response.length);

      for (let i = 0; i < response.length; i++) {
        data[i] = new SupplimentFromEntity(response[i]);
      }

      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async findById(id: string): Promise<SupplimentFromEntity> {
    try {
      const response = await this.supplimentRepository.findOne({
        where: { id },
      });

      const data = new SupplimentFromEntity(response);

      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async findByNom(nom: string): Promise<SupplimentFromEntity[]> {
    try {
      const response = await this.supplimentRepository.find({
        where: { nom: Like(`%${nom}%`) },
      });

      const data = new Array<SupplimentFromEntity>(response.length);

      for (let i = 0; i < response.length; i++) {
        data[i] = new SupplimentFromEntity(response[i]);
      }

      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async update(
    id: string,
    ingredient: SupplimentToEntity,
    access_token: string,
  ): Promise<SupplimentFromEntity> {
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

      await this.supplimentRepository.update(id, ingredient);

      const response = await this.supplimentRepository.findOne({
        where: { id },
      });

      const data = new SupplimentFromEntity(response);

      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async delete(
    id: string,
    access_token: string,
  ): Promise<SupplimentFromEntity> {
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

      const response = await this.supplimentRepository.findOne({
        where: { id },
      });
      await this.supplimentRepository.delete(id);

      const data = new SupplimentFromEntity(response);

      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
