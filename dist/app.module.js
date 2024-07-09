"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const organisateur_1 = require("./modules/organisateur");
const organisateur_2 = require("./entities/organisateur");
const ingredient_1 = require("./entities/ingredient");
const ingredient_2 = require("./modules/ingredient");
const dotenv = require("dotenv");
const nourriture_1 = require("./modules/nourriture");
const nourriture_2 = require("./entities/nourriture");
dotenv.config();
const { SUPABASE_HOST, SUPABASE_PORT, SUPABASE_USERNAME, SUPABASE_PASSWORD, SUPABASE_DATABASE } = process.env;
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: SUPABASE_HOST,
                port: parseInt(SUPABASE_PORT, 10),
                username: SUPABASE_USERNAME,
                password: SUPABASE_PASSWORD,
                database: SUPABASE_DATABASE,
                entities: [organisateur_2.Organisateur, ingredient_1.Ingredient, nourriture_2.Nourriture],
                synchronize: true,
            }),
            organisateur_1.OrganisateurModule,
            ingredient_2.IngredientModule,
            nourriture_1.NourritureModule
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map