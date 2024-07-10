import { Injectable } from '@nestjs/common';
import { CreateOrganisateurDto } from '../dto/create-organisateur.dto';
import { UpdateOrganisateurDto } from '../dto/update-organisateur.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organisateur } from '../entities/organisateur.entity';

@Injectable()
export class OrganisateurService {

  constructor(
    @InjectRepository(Organisateur)
    private organisateurRepository: Repository<Organisateur>,
  ) {}

  async create(organisateur: UpdateOrganisateurDto): Promise<CreateOrganisateurDto> {
    try{
      const response = await this.organisateurRepository.save(organisateur);
      const data = new CreateOrganisateurDto();
      for (let [key, value] of Object.keys(data)) {
        data[key] = response[key]        
      }

      return data;
    }
    catch(error){
      console.log(error);
      return null;
    }
  }

  async findAll(): Promise<CreateOrganisateurDto[]>{
    try{
      const response = await this.organisateurRepository.find();
      const data = new Array<CreateOrganisateurDto>(response.length);

      for (let i = 0; i < response.length; i++) {
        data[i] = new CreateOrganisateurDto();
        for (let [key, value] of Object.keys(data[i])) {
          data[i][key] = response[i][key]        
        }
      
      }
      
      return data;
    }
    catch(error){
      console.log(error);
      return null;
    }
  }

  async findOne(id: string): Promise<CreateOrganisateurDto> {
    try{
      const response = await this.organisateurRepository.findOne({ where: { id } });
      const data = new CreateOrganisateurDto();
      Object.assign(data, response);
      return data;
    }
    catch(error){
      console.log(error);
      return null;
    }
  }

  async update(id: string, organisateur: UpdateOrganisateurDto): Promise<CreateOrganisateurDto> {
    try{
      const updatingData = new Organisateur();
      Object.assign(updatingData, organisateur);
      await this.organisateurRepository.update(id, updatingData);
      
      const response = await this.organisateurRepository.findOne({ where: { id }});
      const findData = new CreateOrganisateurDto();
      Object.assign(findData, response);
      return findData;
    }
    catch(error){
      console.log(error);
      return null;
    }
  }

  async remove(id: string): Promise<CreateOrganisateurDto> {
    try{
      const response = await this.organisateurRepository.findOne({ where: { id }});
      await this.organisateurRepository.delete(id);
      const data = new CreateOrganisateurDto();
      Object.assign(data, response);
      return data;
    }
    catch(error){
      console.log(error);
      return null;
    }
  }

}
