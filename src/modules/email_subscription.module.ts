import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { jwtConstants } from "src/constants/jwt.constant";
import { EmailSubscriptionController } from "src/controllers/email_subscription.controller";
import { EmailSubscription } from "src/entities/email_subscription.entity";
import { Organisateur } from "src/entities/organisateur.entity";
import { EmailSubscriptionService } from "src/services/email_subscription.service";

@Module({
    imports: [TypeOrmModule.forFeature([EmailSubscription, Organisateur]),
    JwtModule.register({
        global: true,
        secret: jwtConstants.secret,
        signOptions: { expiresIn: '999d' },
      }),],
    providers: [EmailSubscriptionService],
    controllers: [EmailSubscriptionController]
})
export class EmailSubscriptionModule {}