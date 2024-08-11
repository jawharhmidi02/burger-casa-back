import { Injectable } from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientSuggestion } from '../entities/client_suggestion.entity';
import { ClientSuggestionFromEntity } from 'src/dto/client_suggestion.dto';
import { ClientSuggestionToEntity } from 'src/dto/client_suggestion.dto';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/constants/jwt.constant';
import { Organisateur } from 'src/entities/organisateur.entity';

@Injectable()
export class ClientSuggestionService {
  constructor(
    @InjectRepository(ClientSuggestion)
    private clientSuggestionRepository: Repository<ClientSuggestion>,
    @InjectRepository(Organisateur)
    private organisateurRepository: Repository<Organisateur>,
    private jwtService: JwtService,
  ) {}

  async create(
    clientSuggestion: ClientSuggestionToEntity,
  ): Promise<ClientSuggestionFromEntity> {
    try {
      const response =
        await this.clientSuggestionRepository.save(clientSuggestion);

      const data = new ClientSuggestionFromEntity(response);

      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async findAll(): Promise<ClientSuggestionFromEntity[]> {
    try {
      const response = await this.clientSuggestionRepository.find();

      const data = new Array<ClientSuggestionFromEntity>(response.length);

      for (let i = 0; i < response.length; i++) {
        data[i] = new ClientSuggestionFromEntity(response[i]);
      }

      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async findById(id: string): Promise<ClientSuggestionFromEntity> {
    try {
      const response = await this.clientSuggestionRepository.findOne({
        where: { id },
      });

      const data = new ClientSuggestionFromEntity(response);
      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async findByNom(nom: string): Promise<ClientSuggestionFromEntity[]> {
    try {
      const response = await this.clientSuggestionRepository.find({
        where: { nom_client: Like(`%${nom}%`) },
      });

      const data = new Array<ClientSuggestionFromEntity>(response.length);

      for (let i = 0; i < response.length; i++) {
        data[i] = new ClientSuggestionFromEntity(response[i]);
      }

      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async delete(
    id: string,
    access_token: string,
  ): Promise<ClientSuggestionFromEntity> {
    try {
      const payLoad = await this.jwtService.verifyAsync(access_token, {
        secret: jwtConstants.secret,
      });

      if (payLoad.role == undefined || payLoad.role != 'admin') {
        return null;
      }

      const account = await this.organisateurRepository.findOne({
        where: { id: payLoad.id },
      });

      if (!account || account.nonce != payLoad.nonce) {
        return null;
      }

      const response = await this.clientSuggestionRepository.findOne({
        where: { id },
      });

      await this.clientSuggestionRepository.delete(id);
      const data = new ClientSuggestionFromEntity(response);

      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
