import { Injectable } from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { WhatsappMessage } from '../entities/whatsapp_message.entity';
import { WhatsappMessageFromEntity } from 'src/dto/whatsapp_message.dto';
import { WhatsappMessageToEntity } from 'src/dto/whatsapp_message.dto';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/constants/jwt.constant';

@Injectable()
export class WhatsappMessageService {
  constructor(
    @InjectRepository(WhatsappMessage)
    private clientSuggestionRepository: Repository<WhatsappMessage>,
    private jwtService: JwtService,
  ) {}

  async create(
    clientSuggestion: WhatsappMessageToEntity,
  ): Promise<WhatsappMessageFromEntity> {
    try {
      const response =
        await this.clientSuggestionRepository.save(clientSuggestion);

      const data = new WhatsappMessageFromEntity(response);

      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async findAll(): Promise<WhatsappMessageFromEntity[]> {
    try {
      const response = await this.clientSuggestionRepository.find();

      const data = new Array<WhatsappMessageFromEntity>(response.length);

      for (let i = 0; i < response.length; i++) {
        data[i] = new WhatsappMessageFromEntity(response[i]);
      }

      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async findById(id: string): Promise<WhatsappMessageFromEntity> {
    try {
      const response = await this.clientSuggestionRepository.findOne({
        where: { id },
      });

      console.log(response);
      

      const data = new WhatsappMessageFromEntity(response);
      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async findByMessageId(id: string): Promise<WhatsappMessageFromEntity> {
    try {
      const response = await this.clientSuggestionRepository.findOne({
        where: { message_id: id },
      });

      const data = new WhatsappMessageFromEntity(response);
      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async findByOrderId(id: string): Promise<WhatsappMessageFromEntity[]> {
    try {
      const response = await this.clientSuggestionRepository.find({
        where: { message_id: id },
      });

      const data = new Array<WhatsappMessageFromEntity>(response.length);

      for (let i = 0; i < response.length; i++) {
        data[i] = new WhatsappMessageFromEntity(response[i]);
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
  ): Promise<WhatsappMessageFromEntity> {
    try {
      const payLoad = await this.jwtService.verifyAsync(access_token, {
        secret: jwtConstants.secret,
      });

      const response = await this.clientSuggestionRepository.findOne({
        where: { id },
      });

      await this.clientSuggestionRepository.delete(id);
      const data = new WhatsappMessageFromEntity(response);

      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}