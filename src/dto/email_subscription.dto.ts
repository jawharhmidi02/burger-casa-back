import { EmailSubscription } from "src/entities/email_subscription.entity";

export class EmailSubscriptionToEntity{
    email: string;
}

export class EmailSubscriptionFromEntity{
    id: string;

    email: string;

    constructor(emailSubscription: EmailSubscription){
        this.email = emailSubscription.email;
        this.id = emailSubscription.id;
    }
}