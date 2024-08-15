import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organisateur } from '../entities/organisateur.entity';
import { OrganisateurFromEntity } from 'src/dto/organisateur.dto';
import { OrganisateurToEntity } from 'src/dto/organisateur.dto';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/constants/jwt.constant';
import { createCipheriv, randomBytes, createDecipheriv } from 'crypto';
import * as nodemailer from 'nodemailer';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

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
  private transporter: any;

  constructor(
    @InjectRepository(Organisateur)
    private organisateurRepository: Repository<Organisateur>,
    private jwtService: JwtService,
    private readonly httpService: HttpService,
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });
  }

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
            role: response.role,
            nonce: response.nonce,
          }),
        };
      }
      return null;
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

      if (payLoad.role == undefined) {
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

  async getAccount(token: string): Promise<OrganisateurFromEntity> {
    try {
      const payLoad = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });

      const response = await this.organisateurRepository.findOne({
        where: { id: payLoad.id },
      });

      const data = new OrganisateurFromEntity(response);

      return data;
    } catch (error) {
      console.log(error);

      return null;
    }
  }

  async sendRecoverPassViaWhatsapp(email: string): Promise<boolean> {
    try {
      const response = await this.organisateurRepository.findOne({
        where: { email },
      });
      if (response) {
        const token = await this.jwtService.signAsync(
          {
            id: response.id,
            email: email,
            nonce: response.nonce,
          },
          { expiresIn: '10m', secret: jwtConstants.secret },
        );

        // Send WhatsApp notification
        const url = `https://graph.facebook.com/v20.0/${process.env.FACEBOOK_ACCOUNT_ID}/messages`;
        const message = `
Hi! We received a request to reset your password. Please click the link below to reset your password:

${process.env.URL}organisateurs/recoverhtml?token=${token}

If you didn't request this, please ignore this message.
`;

        const payload = {
          messaging_product: 'whatsapp',
          to: process.env.FACEBOOK_TO_PHONE,
          type: 'text',
          text: {
            body: message,
          },
        };

        const headers = {
          Authorization: 'Bearer ' + process.env.FACEBOOK_ACCESS_TOKEN,
          'Content-Type': 'application/json',
        };

        const whatsappResponse = await lastValueFrom(
          this.httpService.post(url, payload, { headers }),
        );
        
        return true;
      }

      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async sendRecoverPassViaEmail(email: string): Promise<boolean> {
    try {
      const response = await this.organisateurRepository.findOne({
        where: { email },
      });
      if (response) {
        const token = await this.jwtService.signAsync(
          {
            id: response.id,
            email: email,
            nonce: response.nonce,
          },
          { expiresIn: '10m', secret: jwtConstants.secret },
        );

        const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Recovery</title>
    <style>
        body {
            font-family: 'Roboto', sans-serif;
            background-color: #f4f4f4;
            color: #333;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 1px solid #ddd;
        }
        .header img {
            max-width: 150px;
        }
        .content {
            padding: 20px 0;
        }
        .content p {
            line-height: 1.6;
            margin-bottom: 20px;
        }
        .content a {
            display: inline-block;
            background-color: #F6AA1C;
            color: #fff;
            padding: 10px 20px;
            border-radius: 4px;
            text-decoration: none;
            font-weight: bold;
        }
        .footer {
            text-align: center;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 12px;
            color: #888;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Password Recovery</h1>
        </div>
        <div class="content">
            <p>Hi,</p>
            <p>We received a request to reset your password. Click the button below to change your password:</p>
            <a href="${process.env.URL}organisateurs/recoverhtml?token=${token}" target="_blank">Reset Password</a>
            <p>If you didn't request this, please ignore this email.</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 Restaurant. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

        const mailOptions = {
          from: process.env.GMAIL_USER,
          to: email,
          subject: 'Recover Account',
          html,
        };

        const emailResponse = await this.transporter.sendMail(mailOptions);

        return true;
      }
      return false;
    } catch (error) {
      console.log(error);

      return false;
    }
  }

  async recoverPageHtml(token: string): Promise<string> {
    try {
      const payLoad = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });

      if (payLoad.email == undefined) {
        throw new Error();
      }

      const response = await this.organisateurRepository.findOne({
        where: { email: payLoad.email },
      });

      if (!response || response.nonce != payLoad.nonce) {
        throw Error;
      }

      var html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Restaurant: Reset Password</title>
    <style>
        body {
            font-family: 'Roboto', sans-serif;
            background-color: #f4f4f4;
            color: #333;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 400px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .container h1 {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 1px solid #ddd;
        }
        .form-group {
            margin-bottom: 20px;
        }
        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: bold;
        }
        .form-group input {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        .form-group button {
            width: 100%;
            padding: 10px;
            background-color: #F6AA1C;
            color: #fff;
            border: none;
            border-radius: 4px;
            font-weight: bold;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Reset Your Password</h1>
        <div class="form-group">
            <label for="password">New Password</label>
            <input type="password" id="password" name="password" required>
        </div>
        <div class="form-group">
            <button id="change">Change Password</button>
        </div>
    </div>
    <script>
        document.querySelector('#change').addEventListener('click', async () => {
            const password = document.querySelector('#password').value;
            const token = new URLSearchParams(window.location.search).get('token');

            if (password && token) {
                const response = await fetch('${process.env.URL}organisateurs/changepassfromrecover/' + password + '?token='+token, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (response.ok) {
                    const data = await response.text();
                    if(data == ''){
                      alert('error');
                      return;
                    }
                    alert('Password changed successfully!');
                    // Redirect to login page or another page
                    window.location = '${process.env.FRONT_URL}admin/login';
                } else {
                    alert('Failed to change password. Please try again.');
                }
            } else {
                alert('Please enter a password.');
            }
        });
    </script>
</body>
</html>
`;

      return html;
    } catch (error) {
      console.log(error);
      var html = `Error`;

      return html;
    }
  }

  async changePasswordFromRecover(
    token: string,
    newPassword: string,
  ): Promise<OrganisateurFromEntity> {
    try {
      const payLoad = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });

      if (!payLoad.email) {
        return null;
      }

      const response = await this.organisateurRepository.findOne({
        where: { email: payLoad.email },
      });

      console.log('1');
      console.log(response);

      if (response && response.nonce === payLoad.nonce) {
        const newNonce = randomBytes(16).toString('hex');

        response.nonce = newNonce;
        response.password = encrypt(newPassword);

        await this.organisateurRepository.update(
          { email: payLoad.email },
          response,
        );

        const response2 = await this.organisateurRepository.findOne({
          where: { email: payLoad.email },
        });

        const data = new OrganisateurFromEntity(response2);

        return data;
      }

      return null;
    } catch (error) {
      console.log(error);

      return null;
    }
  }

  async update(
    id: string,
    organisateur: OrganisateurToEntity,
    access_token: string,
  ): Promise<OrganisateurFromEntity> {
    try {
      const payLoad = await this.jwtService.verifyAsync(access_token, {
        secret: jwtConstants.secret,
      });

      if (payLoad.role == undefined) {
        return null;
      }

      if (payLoad.id != id && payLoad.role != 'admin') {
        return null;
      }

      const account = await this.organisateurRepository.findOne({
        where: { id: payLoad.id },
      });

      if (!account || account.nonce != payLoad.nonce) {
        return null;
      }

      await this.organisateurRepository.update(id, organisateur);

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

  async remove(
    id: string,
    access_token: string,
  ): Promise<OrganisateurFromEntity> {
    try {
      const payLoad = await this.jwtService.verifyAsync(access_token, {
        secret: jwtConstants.secret,
      });

      if (payLoad.role == undefined) {
        return null;
      }

      if (payLoad.id != id && payLoad.role != 'admin') {
        return null;
      }

      const account = await this.organisateurRepository.findOne({
        where: { id: payLoad.id },
      });

      if (!account || account.nonce != payLoad.nonce) {
        return null;
      }

      const response = await this.organisateurRepository.findOne({
        where: { id },
      });

      await this.organisateurRepository.delete(id);

      const data = new OrganisateurFromEntity(response);

      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
