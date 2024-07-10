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
const connect_1 = require("./modules/connect");
const ingredient_module_1 = require("./modules/ingredient.module");
const nourriture_module_1 = require("./modules/nourriture.module");
const organisateur_module_1 = require("./modules/organisateur.module");
const ingred_client_choix_module_1 = require("./modules/ingred_client_choix.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            ingred_client_choix_module_1.IngredClientChoixModule,
            connect_1.ConnectModule,
            ingredient_module_1.IngredientModule,
            nourriture_module_1.NourritureModule,
            organisateur_module_1.OrganisateurModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map