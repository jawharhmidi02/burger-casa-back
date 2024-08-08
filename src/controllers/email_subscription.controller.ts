import { Body, Controller, Delete, Get, Headers, Param, Post, Query } from "@nestjs/common";
import { EmailSubscriptionService } from "src/services/email_subscription.service";
import { EmailSubscriptionToEntity, EmailSubscriptionFromEntity } from "src/dto/email_subscription.dto";

@Controller('email-subscription')
export class EmailSubscriptionController{
    constructor(private readonly emailSubscriptionService: EmailSubscriptionService){}

    @Post()
    create(@Body() emailSubscription: EmailSubscriptionFromEntity): Promise<EmailSubscriptionToEntity>{
        return this.emailSubscriptionService.create(emailSubscription);
    }

    @Post('send-emails')
    sendEmailForAll(@Headers('access_token') access_token: string, @Body() body: any){
        return this.emailSubscriptionService.sendEmailForAll(body.subject, body.html, access_token);
    }

    @Get()
    findAll(): Promise<EmailSubscriptionToEntity[]>{
        return this.emailSubscriptionService.findAll();
    }

    @Get('byid/:id')
    findById(@Param('id') id: string): Promise<EmailSubscriptionToEntity>{
        return this.emailSubscriptionService.findById(id);
    }

    @Get('byemail/:email')
    findByEmail(@Param('email') email: string): Promise<EmailSubscriptionToEntity>{
        return this.emailSubscriptionService.findByEmail(email);
    }

    @Delete('byid/:id')
    deleteById(@Param('id') id: string): Promise<EmailSubscriptionToEntity>{
        return this.emailSubscriptionService.deleteById(id);
    }

    @Delete('byemail/:email')
    deleteByEmail(@Param('email') email: string): Promise<EmailSubscriptionToEntity>{
        return this.emailSubscriptionService.deleteByEmail(email);
    }

    @Get('cancel-subs')
    cancelSubs(@Query('token') token: string): Promise<string>{
        return this.emailSubscriptionService.cancelSubscription(token);
    }
}