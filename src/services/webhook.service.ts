import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

Injectable()
export class WebHookService{
    constructor(
        private jwtService: JwtService
    ){}
}