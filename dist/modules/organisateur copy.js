"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganisateurModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const organisateur_1 = require("../entities/organisateur");
const organisateur_2 = require("../services/organisateur");
const organisateur_3 = require("../controllers/organisateur");
let OrganisateurModule = class OrganisateurModule {
};
exports.OrganisateurModule = OrganisateurModule;
exports.OrganisateurModule = OrganisateurModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([organisateur_1.Organisateur])],
        providers: [organisateur_2.OrganisateurService],
        controllers: [organisateur_3.OrganisateurController],
        exports: [organisateur_2.OrganisateurService],
    })
], OrganisateurModule);
//# sourceMappingURL=organisateur%20copy.js.map