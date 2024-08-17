import { OrganisateurService } from './organisateur.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Commande } from 'src/entities/commande.entity';
import { Organisateur } from 'src/entities/organisateur.entity';
import { CommandeFromEntity, CommandeToEntity } from 'src/dto/commande.dto';
import { jwtConstants } from 'src/constants/jwt.constant';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { format } from 'date-fns';
import * as nodemailer from 'nodemailer';
import { WhatsappMessageService } from './whatsapp_message.service';

function formatDate(date: Date): string {
  return format(new Date(date), 'yyyy-MM-dd HH:mm');
}

const { URL } = process.env;
@Injectable()
export class CommandeService {
  private transporter: any;

  constructor(
    @InjectRepository(Commande)
    private commandeRepository: Repository<Commande>,
    private jwtService: JwtService,
    private readonly httpService: HttpService,
    private readonly whatsappMessageService: WhatsappMessageService,
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });
  }

  async create(commande: CommandeToEntity): Promise<any> {
    try {
      const response = await this.commandeRepository.save(commande);

      // Send Email using Nodemailer
      const token = await this.jwtService.signAsync({ id: response.id });

      const verificationUrl = `${URL}commandes/verify-order?token=${token}`;

      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: response.email_client,
        subject: 'Order Verification',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
            <h2 style="text-align: center; color: #4CAF50;">Thank You for Your Order!</h2>
            <p style="font-size: 16px; color: #333;">Dear ${response.nom_client},</p>
            <p style="font-size: 16px; color: #333;">We appreciate your order and are excited to serve you. Please verify your order by clicking the link below:</p>
            <p style="text-align: center;">
              <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #4CAF50; text-decoration: none; border-radius: 5px;">Verify Order</a>
            </p>
            <h3 style="color: #4CAF50;">Order Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px; border: 1px solid #e0e0e0;">Order Total:</td>
                <td style="padding: 10px; border: 1px solid #e0e0e0;">${response.total}&#8364;</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #e0e0e0;">Client Name:</td>
                <td style="padding: 10px; border: 1px solid #e0e0e0;">${response.nom_client}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #e0e0e0;">Phone Number:</td>
                <td style="padding: 10px; border: 1px solid #e0e0e0;">${response.tel_client}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #e0e0e0;">Address:</td>
                <td style="padding: 10px; border: 1px solid #e0e0e0;">${response.adresse}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #e0e0e0;">Order Content:</td>
                <td style="padding: 10px; border: 1px solid #e0e0e0;">${response.content}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #e0e0e0;">Order Type:</td>
                <td style="padding: 10px; border: 1px solid #e0e0e0;">${response.order_type}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #e0e0e0;">Special Request:</td>
                <td style="padding: 10px; border: 1px solid #e0e0e0;">${response.special_request}</td>
              </tr>
            </table>
            <p style="font-size: 16px; color: #333;">If this is not your order and you wish to cancel it, please click the link below:</p>
            <p style="text-align: center;">
              <a href="${URL}commandes/cancel-order?token=${token}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #FF0000; text-decoration: none; border-radius: 5px;">Cancel Order</a>
            </p>
            <p style="font-size: 16px; color: #333;">If you have any questions, feel free to contact us at any time.</p>
            <p style="font-size: 16px; color: #333;">Best regards,<br>BurgerCasa</p>
          </div>
        `,
      };

      const emailResponse = await this.transporter.sendMail(mailOptions);

      const data = new CommandeFromEntity(response);

      return {
        status: 'success',
        commande: data,
        email: emailResponse,
      };
    } catch (error) {
      console.error(error);
      return {
        status: 'error',
        message: error.message,
      };
    }
  }

  async verifyToken(token: string): Promise<string> {
    try {
      const payLoad = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });

      const orderToUpdate = await this.commandeRepository.findOne({
        where: { id: payLoad.id },
      });

      if (orderToUpdate.status === 'Waiting to be Verified...') {
        const response = await this.commandeRepository.findOne({
          where: { id: payLoad.id },
        });

        // Send WhatsApp notification
        const url = `https://graph.facebook.com/v20.0/${process.env.FACEBOOK_ACCOUNT_ID}/messages`;
        const message = `New Order:\n- Name: ${response.nom_client}\n- Phone: ${response.tel_client}\n- Address: ${response.adresse}\n- Order: \n${response.content}\n- Order Type: ${response.order_type}\n- Total: ${response.total}€\n- State: ${response.status}\n- Order ID: ${response.id}\n- Special Request: ${response.special_request}\n- Creation Date: ${formatDate(response.data_creation)}`;

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

        const whatsappBody = {
          message_id: whatsappResponse.data.messages[0].id,
          commande_id: payLoad.id,
        };

        const WhatsappResponse =
          await this.whatsappMessageService.create(whatsappBody);

        await this.commandeRepository.update(
          { id: payLoad.id },
          { status: 'Verified, Waiting to be Prepared' },
        );

        let html = `
        <html>
          <head>
            <title>BurgerCasa: Order Verified</title>
            <style>
              body { font-family: Arial, sans-serif; max-width: 800px; margin: auto; padding: 20px; }
              .container { border: 1px solid #ddd; border-radius: 8px; padding: 20px; }
              h1 { color: #4CAF50; }
              p { font-size: 16px; color: #333; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { padding: 10px; border: 1px solid #ddd; }
              th { background-color: #f4f4f4; }
              .button { display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #4CAF50; text-decoration: none; border-radius: 5px; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Order Verified Successfully!</h1>
              <p>Dear ${response.nom_client},</p>
              <p>Your order has been successfully verified. Here are the details:</p>
              <table>
                <tr>
                  <th>Order Total:</th>
                  <td>${response.total}&#8364;</td>
                </tr>
                <tr>
                  <th>Client Name:</th>
                  <td>${response.nom_client}</td>
                </tr>
                <tr>
                  <th>Phone Number:</th>
                  <td>${response.tel_client}</td>
                </tr>
                <tr>
                  <th>Address:</th>
                  <td>${response.adresse}</td>
                </tr>
                <tr>
                  <th>Order Content:</th>
                  <td>${response.content}</td>
                </tr>
                <tr>
                  <th>Order ID:</th>
                  <td>${response.id}</td>
                </tr>
                <tr>
                  <th>Order Type:</th>
                  <td>${response.order_type}</td>
                </tr>
                <tr>
                  <th>Special Request:</th>
                  <td>${response.special_request}</td>
                </tr>
                <tr>
                  <th>Creation Date:</th>
                  <td>${formatDate(response.data_creation)}</td>
                </tr>
              </table>
              <p>We are preparing your order and will notify you once it’s ready. Thank you for choosing our BurgerCasa!</p>
              <p>Best regards,<br>BurgerCasa</p>
            </div>
          </body>
        </html>
      `;

        console.log('test1');

        return html;
      } else {
        if (orderToUpdate.status === 'Verified, Waiting to be Prepared') {
          const response = await this.commandeRepository.findOne({
            where: { id: payLoad.id },
          });
          let html = `
          <html>
            <head>
              <title>BurgerCasa: Error</title>
              <style>
                body { font-family: Arial, sans-serif; max-width: 800px; margin: auto; padding: 20px; }
                .container { border: 1px solid #ddd; border-radius: 8px; padding: 20px; }
                h1 { color: #FF0000; }
                p { font-size: 16px; color: #333; }
                .button { display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #FF0000; text-decoration: none; border-radius: 5px; }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>Order Already Verified</h1>
                <p>Dear ${response.nom_client},</p>
                <p>Your order has already been verified. Please wait for the preparation of your order.</p>
                <p>Best regards,<br>BurgerCasa</p>
              </div>
            </body>
          </html>
        `;

          return html;
        } else {
          if (orderToUpdate.status === 'Canceled') {
            const response = await this.commandeRepository.findOne({
              where: { id: payLoad.id },
            });
            let html = `
            <html>
              <head>
                <title>BurgerCasa: Cancel Order</title>
                <style>
                  body { font-family: Arial, sans-serif; max-width: 800px; margin: auto; padding: 20px; }
                  .container { border: 1px solid #ddd; border-radius: 8px; padding: 20px; }
                  h1 { color: #FF0000; }
                  p { font-size: 16px; color: #333; }
                  .button { display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #FF0000; text-decoration: none; border-radius: 5px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <h1>Order Canceled</h1>
                  <p>Dear ${response.nom_client},</p>
                  <p>Your order has been canceled.</p>
                  <p>Best regards,<br>BurgerCasa</p>
                </div>
              </body>
            </html>
          `;

            return html;
          }
        }
      }
      throw new Error();
    } catch (error) {
      let html = '';

      console.log('test4');

      const payLoadError = (await this.jwtService.decode(token)) as {
        id: string;
      };

      if (error instanceof TokenExpiredError) {
        console.log('Token has expired');

        await this.commandeRepository.update(
          { id: payLoadError.id, status: 'Waiting to be Verified...' },
          { status: 'Verification Expired' },
        );

        const response = await this.commandeRepository.findOne({
          where: { id: payLoadError.id },
        });

        html = `
          <html>
            <head>
              <title>BurgerCasa: Token Expired</title>
              <style>
                body { font-family: Arial, sans-serif; max-width: 800px; margin: auto; padding: 20px; }
                .container { border: 1px solid #ddd; border-radius: 8px; padding: 20px; }
                h1 { color: #FF0000; }
                p { font-size: 16px; color: #333; }
                .button { display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #FF0000; text-decoration: none; border-radius: 5px; }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>Verification Token Expired</h1>
                <p>Dear ${response.nom_client},</p>
                <p>Your verification token has expired. Please request a new order.</p>
                <p>Best regards,<br>BurgerCasa</p>
              </div>
            </body>
          </html>
        `;

        console.log('test3');

        return html;
      }

      console.log(error.response);

      html = `
        <html>
          <head>
              <title>BurgerCasa: Error</title>
            <style>
              body { font-family: Arial, sans-serif; max-width: 800px; margin: auto; padding: 20px; }
              .container { border: 1px solid #ddd; border-radius: 8px; padding: 20px; }
              h1 { color: #FF0000; }
              p { font-size: 16px; color: #333; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Order Verification Failed</h1>
              <p>There was an error verifying your order. Please try again later or contact support if the issue persists.</p>
              <p>Best regards,<br>BurgerCasa</p>
            </div>
          </body>
        </html>
      `;

      console.log('test2');

      return html;
    }
  }

  async CancelOrder(token: string): Promise<string> {
    try {
      const payLoad = (await this.jwtService.decode(token)) as { id: string };

      const orderToUpdate = await this.commandeRepository.findOne({
        where: { id: payLoad.id },
      });

      if (orderToUpdate.status === 'Waiting to be Verified...') {
        await this.commandeRepository.update(
          { id: payLoad.id },
          { status: 'Canceled' },
        );
      } else {
        if (orderToUpdate.status === 'Canceled') {
          throw new Error('Order not found or already canceled.');
        }
        throw new Error('Order has already been verified.');
      }

      const response = await this.commandeRepository.findOne({
        where: { id: payLoad.id },
      });

      const data = new CommandeFromEntity(response);

      const html = `
      <html>
        <head>
          <title>BurgerCasa: Order Canceled</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: auto; padding: 20px; }
            .container { border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #f9f9f9; }
            h1 { color: #FF5722; }
            p { font-size: 16px; color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { padding: 10px; border: 1px solid #ddd; }
            th { background-color: #f4f4f4; }
            .button { display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #FF5722; text-decoration: none; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Order Canceled Successfully</h1>
            <p>Dear ${response.nom_client},</p>
            <p>Your order has been successfully canceled. Here are the details of the canceled order:</p>
            <table>
              <tr>
                <th>Order Total:</th>
                <td>${response.total}&#8364;</td>
              </tr>
              <tr>
                <th>Client Name:</th>
                <td>${response.nom_client}</td>
              </tr>
              <tr>
                <th>Phone Number:</th>
                <td>${response.tel_client}</td>
              </tr>
              <tr>
                <th>Phone Number:</th>
                <td>${response.email_client}</td>
              </tr>
              <tr>
                <th>Address:</th>
                <td>${response.adresse}</td>
              </tr>
              <tr>
                <th>Order Content:</th>
                <td>${response.content}</td>
              </tr>
              <tr>
                <th>Order ID:</th>
                <td>${response.id}</td>
              </tr>
              <tr>
                <th>Special Request:</th>
                <td>${response.special_request}</td>
              </tr>
              <tr>
                <th>Creation Date:</th>
                <td>${formatDate(response.data_creation)}</td>
              </tr>
            </table>
            <p>If you have any questions or need further assistance, please contact us at [Your Contact Information].</p>
            <p>Thank you for choosing our BurgerCasa!</p>
            <p>Best regards,<br>BurgerCasa</p>
          </div>
        </body>
      </html>
    `;

      return html;
    } catch (error) {
      console.log(error);

      let html = '';

      if (error.message.includes('already canceled')) {
        html = `
        <html>
          <head>
              <title>BurgerCasa: Cancel Failed</title>

            <style>
              body { font-family: Arial, sans-serif; max-width: 800px; margin: auto; padding: 20px; }
              .container { border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #f9f9f9; }
              h1 { color: #FF5722; }
              p { font-size: 16px; color: #333; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Order Cancellation Failed</h1>
              <p>Dear Customer,</p>
              <p>We could not process the cancellation of your order. It may have already been canceled or does not exist.</p>
              <p>Please contact us if you believe this is an error or need further assistance.</p>
              <p>Best regards,<br>BurgerCasa</p>
            </div>
          </body>
        </html>
      `;
      } else if (error.message.includes('already been verified')) {
        html = `
        <html>
          <head>
              <title>BurgerCasa: Order Verified</title>

            <style>
              body { font-family: Arial, sans-serif; max-width: 800px; margin: auto; padding: 20px; }
              .container { border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #f9f9f9; }
              h1 { color: #FF5722; }
              p { font-size: 16px; color: #333; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Order Already Verified</h1>
              <p>Dear Customer,</p>
              <p>The order you are trying to cancel has already been verified and cannot be canceled at this stage.</p>
              <p>If you have any further questions or need assistance, please contact us.</p>
              <p>Best regards,<br>BurgerCasa</p>
            </div>
          </body>
        </html>
      `;
      } else {
        html = `
        <html>
          <head>
              <title>BurgerCasa: Error</title>

            <style>
              body { font-family: Arial, sans-serif; max-width: 800px; margin: auto; padding: 20px; }
              .container { border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #f9f9f9; }
              h1 { color: #FF5722; }
              p { font-size: 16px; color: #333; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Order Cancellation Failed</h1>
              <p>Dear Customer,</p>
              <p>There was an error while processing your cancellation request. Please try again later or contact support for assistance.</p>
              <p>Best regards,<br>BurgerCasa</p>
            </div>
          </body>
        </html>
      `;
      }

      return html;
    }
  }

  async findAll(page: number = 1, limit: number = 1): Promise<any> {
    try {
      const [response, totalItems] = await this.commandeRepository.findAndCount(
        {
          skip: (page - 1) * limit,
          take: limit,
        },
      );

      const data = response.map((item) => new CommandeFromEntity(item));

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

  async findById(id: string): Promise<CommandeFromEntity> {
    try {
      const response = await this.commandeRepository.findOne({
        where: { id },
      });

      const data = new CommandeFromEntity(response);

      return data;
    } catch (error) {
      console.log(error);

      return null;
    }
  }

  async update(
    id: string,
    commande: CommandeToEntity,
    access_token?: string,
    whatsapp_api_key?: string,
  ): Promise<CommandeFromEntity> {
    try {
      if (
        whatsapp_api_key &&
        whatsapp_api_key === process.env.WHATSAPP_API_KEY
      ) {
        await this.commandeRepository.update(id, commande);
      } else {
        const payLoad = await this.jwtService.verifyAsync(access_token, {
          secret: jwtConstants.secret,
        });

        const accountFetch = await fetch(
          `${process.env.URL}organisateurs/byid/${payLoad.id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        if (accountFetch.ok) {
          const account = await accountFetch.json();
          if (!account || account.nonce != payLoad.nonce) {
            return null;
          }
        }

        if (payLoad.role == undefined) {
          return null;
        }

        await this.commandeRepository.update(id, commande);
      }

      const response = await this.commandeRepository.findOne({ where: { id } });

      if (!response) {
        throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
      }

      const data = new CommandeFromEntity(response);

      return data;
    } catch (error) {
      console.log(error);

      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  async delete(id: string, access_token: string): Promise<CommandeFromEntity> {
    try {
      const payLoad = await this.jwtService.verifyAsync(access_token, {
        secret: jwtConstants.secret,
      });

      if (payLoad.role == undefined) {
        return null;
      }

      const accountFetch = await fetch(
        `${process.env.URL}organisateurs/byid/${payLoad.id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (accountFetch.ok) {
        const account = await accountFetch.json();
        if (!account || account.nonce != payLoad.nonce) {
          return null;
        }
      }

      const response = await this.commandeRepository.findOne({
        where: { id },
      });

      await this.commandeRepository.delete(id);

      const data = new CommandeFromEntity(response);

      return data;
    } catch (error) {
      console.log(error);

      return null;
    }
  }
}
