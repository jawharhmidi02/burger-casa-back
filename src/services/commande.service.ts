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
  <h2 style="text-align: center; color: #4CAF50;">Grazie per il tuo ordine!</h2>
  <p style="font-size: 16px; color: #333;">Caro ${response.nom_client},</p>
  <p style="font-size: 16px; color: #333;">Apprezziamo il tuo ordine e siamo entusiasti di servirti. Si prega di verificare il tuo ordine cliccando sul link qui sotto:</p>
  <p style="text-align: center;">
    <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #4CAF50; text-decoration: none; border-radius: 5px;">Verifica Ordine</a>
  </p>
  <h3 style="color: #4CAF50;">Dettagli dell'Ordine</h3>
  <table style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 10px; border: 1px solid #e0e0e0;">Totale Ordine:</td>
      <td style="padding: 10px; border: 1px solid #e0e0e0;">${response.total}&#8364;</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #e0e0e0;">Nome Cliente:</td>
      <td style="padding: 10px; border: 1px solid #e0e0e0;">${response.nom_client}</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #e0e0e0;">Numero di Telefono:</td>
      <td style="padding: 10px; border: 1px solid #e0e0e0;">${response.tel_client}</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #e0e0e0;">Indirizzo:</td>
      <td style="padding: 10px; border: 1px solid #e0e0e0;">${response.adresse}</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #e0e0e0;">Contenuto dell'Ordine:</td>
      <td style="padding: 10px; border: 1px solid #e0e0e0;">${response.content}</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #e0e0e0;">Tipo di Ordine:</td>
      <td style="padding: 10px; border: 1px solid #e0e0e0;">${response.order_type}</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #e0e0e0;">Richiesta Speciale:</td>
      <td style="padding: 10px; border: 1px solid #e0e0e0;">${response.special_request}</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #e0e0e0;">Data di Creazione:</td>
      <td style="padding: 10px; border: 1px solid #e0e0e0;">${formatDate(response.data_creation)}</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #e0e0e0;">Orario Preferito:</td>
      <td style="padding: 10px; border: 1px solid #e0e0e0;">${formatDate(response.prefered_time)}</td>
    </tr>
  </table>
  <p style="font-size: 16px; color: #333;">Se questo non è il tuo ordine e desideri annullarlo, clicca sul link qui sotto:</p>
  <p style="text-align: center;">
    <a href="${URL}commandes/cancel-order?token=${token}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #FF0000; text-decoration: none; border-radius: 5px;">Annulla Ordine</a>
  </p>
  <p style="font-size: 16px; color: #333;">Se hai domande, non esitare a contattarci in qualsiasi momento.</p>
  <p style="font-size: 16px; color: #333;">Cordiali saluti,<br>BurgerCasa</p>
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

  async verifyToken(token: string): Promise<any> {
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
        const message = `Nuovo Ordine:\n- Nome: ${response.nom_client}\n- Telefono: ${response.tel_client}\n- Indirizzo: ${response.adresse}\n- Ordine: \n${response.content}\n- Tipo di Ordine: ${response.order_type}\n- Totale: ${response.total}€\n- Stato: ${response.status}\n- ID Ordine: ${response.id}\n- Richiesta Speciale: ${response.special_request}\n- Data di Creazione: ${formatDate(response.data_creation)}\n- Orario Preferito: ${formatDate(response.prefered_time)}`;

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
          { status: 'Verificato, in attesa di essere preparato' },
        );

        let html = `
        <html>
  <head>
    <title>BurgerCasa: Ordine Verificato</title>
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
      <h1>Ordine Verificato con Successo!</h1>
      <p>Caro/a ${response.nom_client},</p>
      <p>Il tuo ordine è stato verificato con successo. Ecco i dettagli:</p>
      <table>
        <tr>
          <th>Totale Ordine:</th>
          <td>${response.total}&#8364;</td>
        </tr>
        <tr>
          <th>Nome del Cliente:</th>
          <td>${response.nom_client}</td>
        </tr>
        <tr>
          <th>Numero di Telefono:</th>
          <td>${response.tel_client}</td>
        </tr>
        <tr>
          <th>Indirizzo:</th>
          <td>${response.adresse}</td>
        </tr>
        <tr>
          <th>Contenuto dell'Ordine:</th>
          <td>${response.content}</td>
        </tr>
        <tr>
          <th>ID Ordine:</th>
          <td>${response.id}</td>
        </tr>
        <tr>
          <th>Tipo di Ordine:</th>
          <td>${response.order_type}</td>
        </tr>
        <tr>
          <th>Richiesta Speciale:</th>
          <td>${response.special_request}</td>
        </tr>
        <tr>
          <th>Data di Creazione:</th>
          <td>${formatDate(response.data_creation)}</td>
        </tr>
        <tr>
          <th>Orario Preferito:</th>
          <td>${formatDate(response.prefered_time)}</td>
        </tr>
      </table>
      <p>Stiamo preparando il tuo ordine e ti avviseremo non appena sarà pronto. Grazie per aver scelto BurgerCasa!</p>
      <p>Cordiali saluti,<br>BurgerCasa</p>
    </div>
  </body>
</html>

      `;

        return html;
      } else {
        if (orderToUpdate.status === 'Verificato, in attesa di essere preparato') {
          const response = await this.commandeRepository.findOne({
            where: { id: payLoad.id },
          });
          let html = `
          <html>
  <head>
    <title>BurgerCasa: Errore</title>
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
      <h1>Ordine Già Verificato</h1>
      <p>Caro/a ${response.nom_client},</p>
      <p>Il tuo ordine è già stato verificato. Attendi la preparazione del tuo ordine.</p>
      <p>Cordiali saluti,<br>BurgerCasa</p>
    </div>
  </body>
</html>

        `;

          return html;
        } else {
          if (orderToUpdate.status === 'Annullato') {
            const response = await this.commandeRepository.findOne({
              where: { id: payLoad.id },
            });
            let html = `
            <html>
  <head>
    <title>BurgerCasa: Annulla Ordine</title>
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
      <h1>Ordine Annullato</h1>
      <p>Caro/a ${response.nom_client},</p>
      <p>Il tuo ordine è stato annullato.</p>
      <p>Cordiali saluti,<br>BurgerCasa</p>
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
    <title>BurgerCasa: Token Scaduto</title>
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
      <h1>Token di Verifica Scaduto</h1>
      <p>Caro/a ${response.nom_client},</p>
      <p>Il tuo token di verifica è scaduto. Per favore, richiedi un nuovo ordine.</p>
      <p>Cordiali saluti,<br>BurgerCasa</p>
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
    <title>BurgerCasa: Errore</title>
    <style>
      body { font-family: Arial, sans-serif; max-width: 800px; margin: auto; padding: 20px; }
      .container { border: 1px solid #ddd; border-radius: 8px; padding: 20px; }
      h1 { color: #FF0000; }
      p { font-size: 16px; color: #333; }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Verifica Ordine Fallita</h1>
      <p>C'è stato un errore nella verifica del tuo ordine. Riprova più tardi o contatta il supporto se il problema persiste.</p>
      <p>Cordiali saluti,<br>BurgerCasa</p>
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
          { status: 'Annullato' },
        );
      } else {
        if (orderToUpdate.status === 'Annullato') {
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
  <title>BurgerCasa: Ordine Annullato</title>
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
    <h1>Ordine Annullato con Successo</h1>
    <p>Caro ${response.nom_client},</p>
    <p>Il tuo ordine è stato annullato con successo. Ecco i dettagli dell'ordine annullato:</p>
    <table>
      <tr>
        <th>Totale Ordine:</th>
        <td>${response.total}&#8364;</td>
      </tr>
      <tr>
        <th>Nome Cliente:</th>
        <td>${response.nom_client}</td>
      </tr>
      <tr>
        <th>Numero di Telefono:</th>
        <td>${response.tel_client}</td>
      </tr>
      <tr>
        <th>Email Cliente:</th>
        <td>${response.email_client}</td>
      </tr>
      <tr>
        <th>Indirizzo:</th>
        <td>${response.adresse}</td>
      </tr>
      <tr>
        <th>Contenuto dell'Ordine:</th>
        <td>${response.content}</td>
      </tr>
      <tr>
        <th>ID Ordine:</th>
        <td>${response.id}</td>
      </tr>
      <tr>
        <th>Richiesta Speciale:</th>
        <td>${response.special_request}</td>
      </tr>
      <tr>
        <th>Data di Creazione:</th>
        <td>${formatDate(response.data_creation)}</td>
      </tr>
      <tr>
        <th>Orario Preferito:</th>
        <td>${formatDate(response.prefered_time)}</td>
      </tr>
    </table>
    <p>Se hai domande o hai bisogno di ulteriore assistenza, contattaci al +39 375 693 3442.</p>
    <p>Grazie per aver scelto BurgerCasa!</p>
    <p>Cordiali saluti,<br>BurgerCasa</p>
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
  <title>BurgerCasa: Annullamento Fallito</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: auto; padding: 20px; }
    .container { border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #f9f9f9; }
    h1 { color: #FF5722; }
    p { font-size: 16px; color: #333; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Annullamento dell'Ordine Fallito</h1>
    <p>Caro Cliente,</p>
    <p>Non siamo riusciti a elaborare l'annullamento del tuo ordine. Potrebbe essere già stato annullato o non esistere.</p>
    <p>Contattaci se pensi che questo sia un errore o se hai bisogno di ulteriore assistenza.</p>
    <p>Cordiali saluti,<br>BurgerCasa</p>
  </div>
</body>
</html>

      `;
      } else if (error.message.includes('already been verified')) {
        html = `
        <html>
<head>
  <title>BurgerCasa: Ordine Verificato</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: auto; padding: 20px; }
    .container { border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #f9f9f9; }
    h1 { color: #FF5722; }
    p { font-size: 16px; color: #333; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Ordine Già Verificato</h1>
    <p>Caro Cliente,</p>
    <p>L'ordine che stai tentando di annullare è già stato verificato e non può essere annullato a questo punto.</p>
    <p>Se hai ulteriori domande o hai bisogno di assistenza, contattaci.</p>
    <p>Cordiali saluti,<br>BurgerCasa</p>
  </div>
</body>
</html>

      `;
      } else {
        html = `
        <html>
<head>
  <title>BurgerCasa: Errore</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: auto; padding: 20px; }
    .container { border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #f9f9f9; }
    h1 { color: #FF5722; }
    p { font-size: 16px; color: #333; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Annullamento dell'Ordine Fallito</h1>
    <p>Caro Cliente,</p>
    <p>Si è verificato un errore durante l'elaborazione della tua richiesta di annullamento. Riprova più tardi o contatta il supporto per assistenza.</p>
    <p>Cordiali saluti,<br>BurgerCasa</p>
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
