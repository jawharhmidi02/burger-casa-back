import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { WebHookService } from 'src/services/webhook.service';
import { Response } from 'express';

const { WEBHOOK_VERIFY_TOKEN } = process.env;

@Controller('webhook')
export class WebHookController {
  constructor(private readonly webhookService: WebHookService) {}

  @Post()
  async handleWebHook(@Body() body: any): Promise<void> {
    await this.webhookService.handleWebHook(body);
  }

  @Get()
  async getWebHook(
    @Query('hub.mode') mode: any,
    @Query('hub.verify_token') token: any,
    @Query('hub.challenge') challenge: any,
    @Res() res: Response,
  ): Promise<void> {
    if (mode === 'subscribe' && token === WEBHOOK_VERIFY_TOKEN) {
      console.log('Webhook verified');
      res.status(200).send(challenge);
    } else {
      res.status(403).send();
    }
  }
}
