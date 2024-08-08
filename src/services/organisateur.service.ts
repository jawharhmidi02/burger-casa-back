import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organisateur } from '../entities/organisateur.entity';
import { OrganisateurFromEntity } from 'src/dto/organisateur.dto';
import { OrganisateurToEntity } from 'src/dto/organisateur.dto';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/constants/jwt.constant';
import { createCipheriv, randomBytes, createDecipheriv } from 'crypto';

const algorithm = 'aes-256-cbc';
const key = Buffer.from(process.env.CRYPTO_SECRET_KEY, 'hex');
const iv = randomBytes(16);

function encrypt(text: string) {
  let cipher = createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text: string) {
  let textParts = text.split(':');
  let iv = Buffer.from(textParts.shift(), 'hex');
  let encryptedText = Buffer.from(textParts.join(':'), 'hex');
  let decipher = createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

@Injectable()
export class OrganisateurService {
  constructor(
    @InjectRepository(Organisateur)
    private organisateurRepository: Repository<Organisateur>,
    private jwtService: JwtService,
  ) {}

  async signup(
    organisateur: OrganisateurToEntity,
  ): Promise<OrganisateurFromEntity> {
    try {
      organisateur.password = encrypt(organisateur.password);
      const response = await this.organisateurRepository.save(organisateur);
      const data = new OrganisateurFromEntity(response);

      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async verifyEmail(email: string): Promise<boolean> {
    try {
      const response = await this.organisateurRepository.findOne({
        where: { email },
      });
      if (response) {
        return true;
      }
      return false;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async findAll(access_token: string): Promise<OrganisateurFromEntity[]> {
    try {
      const payLoad = await this.jwtService.verifyAsync(access_token, {
        secret: jwtConstants.secret,
      });

      if (payLoad.dialogues == undefined) {
        return null;
      }

      const response = await this.organisateurRepository.find();
      const data = new Array<OrganisateurFromEntity>(response.length);

      for (let i = 0; i < response.length; i++) {
        data[i] = new OrganisateurFromEntity(response[i]);
      }

      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async signin(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    try {
      const response = await this.organisateurRepository.findOne({
        where: { email },
      });
      if (decrypt(response.password) !== password) {
        return null;
      }
      if (response) {
        return {
          access_token: await this.jwtService.signAsync({
            id: response.id,
            dialogues: response.dialogues,
          }),
        };
      }
      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async findById(id: string): Promise<OrganisateurFromEntity> {
    try {
      const response = await this.organisateurRepository.findOne({
        where: { id },
      });
      const data = new OrganisateurFromEntity(response);
      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async update(
    email: string,
    password: string,
    organisateur: OrganisateurToEntity,
    access_token: string,
  ): Promise<OrganisateurFromEntity> {
    try {
      const payLoad = await this.jwtService.verifyAsync(access_token, {
        secret: jwtConstants.secret,
      });

      if (payLoad.dialogues == undefined) {
        return null;
      }

      await this.organisateurRepository.update(
        { email, password },
        organisateur,
      );

      const response = await this.organisateurRepository.findOne({
        where: { email, password },
      });
      const data = new OrganisateurFromEntity(response);
      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async remove(
    email: string,
    password: string,
    access_token: string,
  ): Promise<OrganisateurFromEntity> {
    try {
      const payLoad = await this.jwtService.verifyAsync(access_token, {
        secret: jwtConstants.secret,
      });

      if (payLoad.dialogues == undefined) {
        return null;
      }

      const response = await this.organisateurRepository.findOne({
        where: { email, password },
      });
      await this.organisateurRepository.delete({ email, password });
      const data = new OrganisateurFromEntity(response);
      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
