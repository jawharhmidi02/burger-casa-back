import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailSubscription } from 'src/entities/email_subscription.entity';
import { Repository } from 'typeorm';
import {
  EmailSubscriptionToEntity,
  EmailSubscriptionFromEntity,
} from 'src/dto/email_subscription.dto';
import { JwtService } from '@nestjs/jwt';
import * as nodemailer from 'nodemailer';
import { jwtConstants } from 'src/constants/jwt.constant';
import { Organisateur } from 'src/entities/organisateur.entity';

const { URL } = process.env;

@Injectable()
export class EmailSubscriptionService {
  private transporter: any;

  constructor(
    @InjectRepository(EmailSubscription)
    private emailSubscriptionRepository: Repository<EmailSubscription>,
    private jwtService: JwtService,
    @InjectRepository(Organisateur)
    private organisateurRepository: Repository<Organisateur>,
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });
  }

  async create(
    emailSubscription: EmailSubscriptionToEntity,
  ): Promise<EmailSubscriptionFromEntity> {
    try {
      const response =
        await this.emailSubscriptionRepository.save(emailSubscription);

      const token = await this.jwtService.signAsync({ id: response.id });

      const cancelUrl = `${URL}email-subscription/cancel-subs?token=${token}`;

      const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
  a{
  color: white;
  }
    body {
      font-family: "Roboto", sans-serif;
      color: #601a03;
      margin: 0;
      padding: 0;
      line-height: 1.6;
    }
    .container {
      max-width: 600px;
      margin: auto;
      padding: 20px;
      border: 1px solid #941B0C;
      border-radius: 10px;
    }
    .header {
      text-align: center;
      background-color: #F6AA1C;
      padding: 20px;
      border-radius: 10px 10px 0 0;
    }
    .header h1 {
      margin: 0;
      color: #621708;
      font-family: "Roboto Mono", sans-serif;
    }
    .content {
      padding: 20px;
      color: #601a03;
    }
    .content h2 {
      color: #BC3908;
    }
      .content a{
        color: white !important;
      }
    .button {
      display: inline-block;
      padding: 10px 20px;
      margin: 20px 0;
      background-color: #941B0C;
      color: #ffffff;
      text-decoration: none;
      border-radius: 5px;
      font-family: "Rubik", sans-serif;
    }
    .footer {
      text-align: center;
      padding: 10px;
      font-size: 12px;
      color: #621708;
      font-family: "Roboto", sans-serif;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to Our Newsletter!</h1>
    </div>
    <div class="content">
      <h2>Thank you for subscribing!</h2>
      <p>We're excited to have you on board. You'll now receive the latest news, offers, and updates directly to your inbox.</p>
      <p>If you wish to unsubscribe at any time, simply click the button below:</p>
      <a href="${cancelUrl}" class="button">Unsubscribe</a>
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
        to: response.email,
        subject: 'Welcome to Our Newsletter!',
        html,
      };

      const emailResponse = await this.transporter.sendMail(mailOptions);

      const data = new EmailSubscriptionFromEntity(response);

      return data;
    } catch (error) {
      console.log(error);

      return null;
    }
  }

  async sendEmailForAll(
    subject: string,
    html: string,
    access_token: string,
  ): Promise<any> {
    try {
      const payLoad = await this.jwtService.verifyAsync(access_token);

      if (payLoad.role == undefined || payLoad.role != 'admin') {
        return null;
      }

      const emails = await this.findAll();
      const emailResponses = Array();

      for (let i = 0; i < emails.length; i++) {
        const mailOptions = {
          from: process.env.GMAIL_USER,
          to: emails[i].email,
          subject,
          html,
        };

        const emailResponse = await this.transporter.sendMail(mailOptions);

        emailResponses.push(emailResponse);
      }

      return emailResponses;
    } catch (error) {
      console.log(error);

      return null;
    }
  }

  async findAll(): Promise<EmailSubscriptionFromEntity[]> {
    try {
      const response = await this.emailSubscriptionRepository.find();

      const data = response.map(
        (item) => new EmailSubscriptionFromEntity(item),
      );

      return data;
    } catch (error) {
      console.log(error);

      return null;
    }
  }

  async findById(id: string): Promise<EmailSubscriptionFromEntity> {
    try {
      const response = await this.emailSubscriptionRepository.findOne({
        where: { id },
      });

      const data = new EmailSubscriptionFromEntity(response);

      return data;
    } catch (error) {
      console.log(error);

      return null;
    }
  }

  async findByEmail(email: string): Promise<EmailSubscriptionFromEntity> {
    try {
      const response = await this.emailSubscriptionRepository.findOne({
        where: { email },
      });

      const data = new EmailSubscriptionFromEntity(response);

      return data;
    } catch (error) {
      console.log(error);

      return null;
    }
  }

  async deleteById(
    access_token: string,
    id: string,
  ): Promise<EmailSubscriptionFromEntity> {
    try {
      const payLoad = await this.jwtService.verifyAsync(access_token);

      if (payLoad.role == undefined || payLoad.role != 'admin') {
        return null;
      }

      const account = await this.organisateurRepository.findOne({
        where: { id: payLoad.id },
      });

      if (!account || account.nonce != payLoad.nonce) {
        return null;
      }

      const response = await this.emailSubscriptionRepository.findOne({
        where: { id },
      });

      await this.emailSubscriptionRepository.delete({ id });

      const data = new EmailSubscriptionFromEntity(response);

      return data;
    } catch (error) {
      console.log(error);

      return null;
    }
  }

  async deleteByEmail(
    access_token: string,
    email: string,
  ): Promise<EmailSubscriptionFromEntity> {
    try {
      const payLoad = await this.jwtService.verifyAsync(access_token);

      if (payLoad.role == undefined || payLoad.role != 'admin') {
        return null;
      }

      const account = await this.organisateurRepository.findOne({
        where: { id: payLoad.id },
      });

      if (!account || account.nonce != payLoad.nonce) {
        return null;
      }

      const response = await this.emailSubscriptionRepository.findOne({
        where: { email },
      });

      await this.emailSubscriptionRepository.delete({ email });

      const data = new EmailSubscriptionFromEntity(response);

      return data;
    } catch (error) {
      console.log(error);

      return null;
    }
  }

  async cancelSubscription(token: string): Promise<string> {
    try {
      const payload = await this.jwtService.verifyAsync(token);

      const response = await this.emailSubscriptionRepository.findOne({
        where: { id: payload.id },
      });

      if (response) {
        await this.emailSubscriptionRepository.delete({ id: response.id });

        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
  :root{
  ---first-color: #F6AA1C;
    ---second-color: #BC3908;
    ---third-color: #941B0C;
    ---fourth-color: #621708;
    ---fifth-color: #601a03;
    ---first-family: "Roboto Mono", sans-serif;
    ---second-family: "Roboto", sans-serif;
    ---third-family: "Rubik", sans-serif;
    ---fourth-family: "Roboto", sans-serif;
    ---background-color: #ffffff;}
    body {
      font-family: var(---second-family), sans-serif;
      background-color: var(---background-color);
      color: var(---fifth-color);
      margin: 0;
      padding: 0;
      line-height: 1.6;
    }
    .container {
      max-width: 600px;
      margin: auto;
      padding: 20px;
      border: 1px solid var(---third-color);
      border-radius: 10px;
      background-color: var(---background-color);
    }
    .header {
      text-align: center;
      background-color: var(---second-color);
      padding: 20px;
      border-radius: 10px 10px 0 0;
    }
    .header h1 {
      margin: 0;
      color: var(---fourth-color);
      font-family: var(---first-family);
    }
    .content {
      padding: 20px;
      color: var(---fifth-color);
    }
    .content h2 {
      color: var(---third-color);
    }
    .footer {
      text-align: center;
      padding: 10px;
      font-size: 12px;
      color: var(---fourth-color);
      font-family: var(---fourth-family);
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Subscription Canceled</h1>
    </div>
    <div class="content">
      <h2>We're sorry to see you go!</h2>
      <p>Your subscription has been successfully canceled. You will no longer receive our newsletters and offers.</p>
      <p>If this was a mistake or if you change your mind, feel free to resubscribe anytime!</p>
    </div>
    <div class="footer">
      <p>&copy; 2024 Restaurant. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

        return html;
      } else {
        throw new Error('Subscription not found');
      }
    } catch (error) {
      console.log(error);

      const html = `
        <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
  :root{
  ---first-color: #F6AA1C;
    ---second-color: #BC3908;
    ---third-color: #941B0C;
    ---fourth-color: #621708;
    ---fifth-color: #601a03;
    ---first-family: "Roboto Mono", sans-serif;
    ---second-family: "Roboto", sans-serif;
    ---third-family: "Rubik", sans-serif;
    ---fourth-family: "Roboto", sans-serif;
    ---background-color: #ffffff;}
    body {
      font-family: var(---second-family), sans-serif;
      background-color: var(---background-color);
      color: var(---fifth-color);
      margin: 0;
      padding: 0;
      line-height: 1.6;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      padding: 30px;
      border: 1px solid var(---third-color);
      border-radius: 12px;
      background-color: var(---background-color);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      background-color: var(---second-color);
      padding: 25px;
      border-radius: 12px 12px 0 0;
    }
    .header h1 {
      margin: 0;
      color: var(---background-color);
      font-family: var(---first-family);
      font-size: 24px;
    }
    .content {
      padding: 25px;
      color: var(---fifth-color);
    }
    .content h2 {
      color: var(---third-color);
      font-size: 20px;
      margin-bottom: 15px;
    }
    .content p {
      margin-bottom: 20px;
      font-size: 16px;
    }
    .footer {
      text-align: center;
      padding: 15px;
      font-size: 14px;
      color: var(---fourth-color);
      font-family: var(---fourth-family);
      border-top: 1px solid var(---third-color);
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Error Cancelling Subscription</h1>
    </div>
    <div class="content">
      <h2>Oops! Something went wrong.</h2>
      <p>We couldn't process your cancellation at this time. Please try again later.</p>
      <p>If the problem persists, feel free to contact our support team for assistance.</p>
    </div>
    <div class="footer">
      <p>&copy; 2024 Your Restaurant Name. All rights reserved.</p>
    </div>
  </div>
</body>
</html>

      `;

      return html;
    }
  }
}
