import { CommandeService } from 'src/services/commande.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WhatsappMessageService } from './whatsapp_message.service';
import { format } from 'date-fns';
import axios from 'axios';

function formatDate(date: Date): string {
  return format(new Date(date), 'yyyy-MM-dd HH:mm');
}

const { FACEBOOK_ACCESS_TOKEN, WHATSAPP_API_KEY } = process.env;

@Injectable()
export class WebHookService {
  constructor(
    private readonly whatsappMessageService: WhatsappMessageService,
    private readonly commandeService: CommandeService,
  ) {}

  async handleWebHook(body: any) {
    try {
      console.log('Incoming webhook message');

      const message = body.entry?.[0]?.changes[0]?.value?.messages?.[0];

      if (message?.type === 'text') {
        const business_phone_number_id =
          body.entry?.[0].changes?.[0].value?.metadata?.phone_number_id;

        if (message.context && message.context.id) {
          console.log(
            'This message is a reply to message ID:',
            message.context.id,
          );

          const exist = await this.whatsappMessageService.findByMessageId(
            message.context.id,
          );

          if (exist != null) {
            const keyword = message.text.body.trim().toLowerCase();

            const order = await this.commandeService.findById(
              exist.commande_id,
            );

            let newStatus: string;
            switch (keyword) {
              case 'inizia':
                newStatus = 'In Corso';
                break;
              case 'pronto':
                newStatus = 'Preparato';
                break;
              case 'uscito':
                newStatus = 'In Consegna';
                break;
              case 'ritirato':
                newStatus = 'Ritirato';
                break;
              case 'consegnato':
                newStatus = 'Consegnato';
                break;
              case 'annulla':
                newStatus = 'Annullato';
                break;
              default:
                console.log('Unknown State');
                return;
            }

            const response = await this.commandeService.update(
              exist.commande_id,
              { status: newStatus },
              null,
              WHATSAPP_API_KEY,
            );

            // const content = `New Order:\n- Name: ${
            //   response.nom_client
            // }\n- Phone: ${response.tel_client}\n- Address: ${
            //   response.adresse
            // }\n- Order: \n${response.content}\n- Order Type: ${
            //   response.order_type
            // }\n- Total: ${response.total}€\n- State: ${
            //   response.status
            // }\n- Order ID: ${response.id}\n- Special Request: ${
            //   response.special_request
            // }\n- Creation Date: ${formatDate(response.data_creation)}`;
            const content = `Nuovo Ordine:\n- Nome: ${response.nom_client}\n- Telefono: ${response.tel_client}\n- Indirizzo: ${response.adresse}\n- Ordine: \n${response.content}\n- Tipo di Ordine: ${response.order_type}\n- Totale: ${response.total}€\n- Stato: ${response.status}\n- ID Ordine: ${response.id}\n- Richiesta Speciale: ${response.special_request}\n- Data di Creazione: ${formatDate(response.data_creation)}\n- Orario Preferito: ${formatDate(response.prefered_time)}`;

            const whatsappResponse = await axios({
              method: 'POST',
              url: `https://graph.facebook.com/v20.0/${business_phone_number_id}/messages`,
              headers: {
                Authorization: `Bearer ${FACEBOOK_ACCESS_TOKEN}`,
                'Content-Type': 'application/json',
              },
              data: {
                messaging_product: 'whatsapp',
                type: 'text',
                text: {
                  body: content,
                },
                to: message.from,
                context: {
                  message_id: message.id,
                },
              },
            });

            const whatsappBody = {
              message_id: whatsappResponse.data.messages[0].id,
              commande_id: response.id,
            };

            const WhatsappResponse =
              await this.whatsappMessageService.create(whatsappBody);
          }
        }

        // send a reply message
        // await axios({
        //   method: "POST",
        //   url: `https://graph.facebook.com/v20.0/${business_phone_number_id}/messages`,
        //   headers: {
        //     Authorization: `Bearer ${FACEBOOK_ACCESS_TOKEN}`,
        //   },
        //   data: {
        //     messaging_product: "whatsapp",
        //     to: message.from,
        //     text: { body: "Reply: " + message.text.body },
        //     context: {
        //       message_id: message.id, // shows the message as a reply to the original user message
        //     },
        //   },
        // });

        // mark incoming message as read
        await axios({
          method: 'POST',
          url: `https://graph.facebook.com/v20.0/${business_phone_number_id}/messages`,
          headers: {
            Authorization: `Bearer ${FACEBOOK_ACCESS_TOKEN}`,
          },
          data: {
            messaging_product: 'whatsapp',
            status: 'read',
            message_id: message.id,
          },
        });

        // send reaction
        // await axios({
        //   method: "POST",
        //   url: `https://graph.facebook.com/v20.0/${business_phone_number_id}/messages`,
        //   headers: {
        //     Authorization: `Bearer ${FACEBOOK_ACCESS_TOKEN}`,
        //   },
        //   data: {
        //     messaging_product: "whatsapp",
        //     to: message.from,
        //     recipient_type: "individual",
        //     type: "reaction",
        //     reaction: {
        //       message_id: message.id,
        //       emoji: "\uD83D\uDE00", // Smiling face emoji
        //     },
        //   },
        // });
      }

      return;
    } catch (error) {
      console.error(
        'Error processing webhook:',
        error.response ? error.response.data : error.message,
      );
      throw Error;
    }
  }
}
