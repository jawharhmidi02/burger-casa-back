import { Controller, Get } from "@nestjs/common";
import { PingService } from "src/services/ping_database.service";

@Controller('ping-database')
export class PingController {
  constructor(private readonly pingService: PingService) {}

  @Get()
  checkHealth(){
    this.pingService.pingDatabase();
  }
}