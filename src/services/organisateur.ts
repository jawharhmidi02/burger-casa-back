import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Organisateur } from '../entities/organisateur';

@Injectable()
export class OrganisateurService {

  constructor(
    @InjectRepository(Organisateur)
    private organisateurRepository: Repository<Organisateur>,
  ) {}

  async create(organisateur: Organisateur): Promise<Organisateur> {
    try{
      const response = await this.organisateurRepository.save(organisateur);
      return response;
    }
    catch(error){
      console.log(error);
      return null;
    }
  }

  async findAll(): Promise<Organisateur[]>{
    try{
      const response = await this.organisateurRepository.find();
      return response;
    }
    catch(error){
      console.log(error);
      return null;
    }
}

  async findOne(id: string): Promise<Organisateur> {
    try{
      const response = await this.organisateurRepository.findOne({ where: { id } });
      return response;
    }
    catch(error){
      console.log(error);
      return null;
    }
  }

  async update(id: string, organisateur: Organisateur): Promise<Organisateur> {
    try{
      await this.organisateurRepository.update(id, organisateur);
      return this.organisateurRepository.findOne({ where: { id }});
    }
    catch(error){
      console.log(error);
      return null;
    }
  }

  async remove(id: string): Promise<Organisateur> {
    try{
      const response = await this.organisateurRepository.findOne({ where: { id }});
      await this.organisateurRepository.delete(id);
      return response;
    }
    catch(error){
      console.log(error);
      return null;
    }
  }

}
