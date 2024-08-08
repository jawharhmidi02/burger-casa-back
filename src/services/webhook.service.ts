import { CommandeService } from 'src/services/commande.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WhatsappMessageService } from './whatsapp_message.service';
import { format } from 'date-fns';
import axios from 'axios';

function formatDate(date: Date): string {
  return format(new Date(date), 'yyyy-MM-dd HH:mm');
}

const { GRAPH_API_TOKEN, WHATSAPP_API_KEY } = process.env;

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

          //   const exist = await axios({
          //     method: 'GET',
          //     url: `${BACKEND_URL}/whatsapp_messages/bymessageid/${message.context.id}`,
          //     headers: {
          //       'ngrok-skip-browser-warning': 'true',
          //     },
          //   });

          const exist = await this.whatsappMessageService.findByMessageId(
            message.context.id,
          );

          if (exist != null) {
            const keyword = message.text.body.trim().toLowerCase();

            // const order = await axios({
            //   method: 'GET',
            //   url: `${BACKEND_URL}/commandes/${exist.data.commande_id}`,
            // });

            const order = await this.commandeService.findById(
              exist.commande_id,
            );

            let newStatus: string;
            switch (keyword) {
              case 'start':
                newStatus = 'In Progress';
                break;
              case 'ready':
                newStatus = 'Prepared';
                break;
              case 'out':
                newStatus = 'Out for Delivery';
                break;
              case 'picked':
                newStatus = 'Picked Up';
                break;
              case 'delivered':
                newStatus = 'Delivered';
                break;
              case 'cancel':
                newStatus = 'Cancelled';
                break;
              default:
                console.log('Unknown keyword received');
                return;
            }

            // const responseData = await axios({
            //   method: 'PUT',
            //   url: `${BACKEND_URL}/commandes/${exist.data.commande_id}`,
            //   headers: {
            //     whatsapp_api_key: WHATSAPP_API_KEY,
            //   },
            //   data: {
            //     status: newStatus,
            //   },
            // });

            const response = await this.commandeService.update(
              exist.commande_id,
              { status: newStatus },
              null,
              WHATSAPP_API_KEY,
            );

            // Send WhatsApp notification
            const content = `New Order:\n- Name: ${
              response.nom_client
            }\n- Phone: ${response.tel_client}\n- Address: ${
              response.adresse
            }\n- Order: \n${response.content}\n- Order Type: ${
              response.order_type
            }\n- Total: ${response.total} DT\n- State: ${
              response.status
            }\n- Order ID: ${response.id}\n- Special Request: ${
              response.special_request
            }\n- Creation Date: ${formatDate(response.data_creation)}`;

            const whatsappResponse = await axios({
              method: 'POST',
              url: `https://graph.facebook.com/v20.0/${business_phone_number_id}/messages`,
              headers: {
                Authorization: `Bearer ${GRAPH_API_TOKEN}`,
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
                  message_id: message.id, // shows the message as a reply to the original user message
                },
              },
            });

            const whatsappBody = {
              message_id: whatsappResponse.data.messages[0].id,
              commande_id: response.id,
            };

            const WhatsappResponse =
              await this.whatsappMessageService.create(whatsappBody);

            // const WhatsappResponse = await axios({
            //   method: 'POST',
            //   url: `${BACKEND_URL}/whatsapp_messages/`,
            //   headers: {
            //     'ngrok-skip-browser-warning': 'true', // Include this header to bypass the warning
            //   },
            //   data: whatsappBody,
            // });
          }
        }

        // send a reply message
        // await axios({
        //   method: "POST",
        //   url: `https://graph.facebook.com/v20.0/${business_phone_number_id}/messages`,
        //   headers: {
        //     Authorization: `Bearer ${GRAPH_API_TOKEN}`,
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
            Authorization: `Bearer ${GRAPH_API_TOKEN}`,
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
        //     Authorization: `Bearer ${GRAPH_API_TOKEN}`,
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
