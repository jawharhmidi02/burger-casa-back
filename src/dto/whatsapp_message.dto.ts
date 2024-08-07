import { WhatsappMessage } from "src/entities/whatsapp_message.entity";

export class WhatsappMessageToEntity{
    message_id: string;
    
    commande_id: string;
}

export class WhatsappMessageFromEntity{
    id: string;

    message_id: string;
    
    commande_id: string;

    constructor(whatsappMessage: WhatsappMessage){
        this.id = whatsappMessage.id;
        this.message_id = whatsappMessage.message_id;
        this.commande_id = whatsappMessage.commande_id;
    }
}