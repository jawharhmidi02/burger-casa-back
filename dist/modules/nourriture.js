"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NourritureModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nourriture_1 = require("src/controllers/nourriture");
const nourriture_2 = require("src/entities/nourriture");
const nourriture_3 = require("src/services/nourriture");
let NourritureModule = class NourritureModule {
};
exports.NourritureModule = NourritureModule;
exports.NourritureModule = NourritureModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([nourriture_2.Nourriture])],
        providers: [nourriture_3.NourritureService],
        controllers: [nourriture_1.NourritureController],
        exports: [nourriture_3.NourritureService]
    })
], NourritureModule);
//# sourceMappingURL=nourriture.js.map