"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nourriture = void 0;
const typeorm_1 = require("typeorm");
const ingredient_entity_1 = require("../ingredient/entities/ingredient.entity");
let Nourriture = class Nourriture {
};
exports.Nourriture = Nourriture;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Nourriture.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Nourriture.prototype, "nom", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float' }),
    __metadata("design:type", Number)
], Nourriture.prototype, "prix", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Nourriture.prototype, "photo", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Nourriture.prototype, "categorie", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Nourriture.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Nourriture.prototype, "disponible", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => ingredient_entity_1.Ingredient),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], Nourriture.prototype, "ingredients", void 0);
exports.Nourriture = Nourriture = __decorate([
    (0, typeorm_1.Entity)()
], Nourriture);
//# sourceMappingURL=nourriture.js.map