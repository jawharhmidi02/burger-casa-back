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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NourritureController = void 0;
const nourriture_1 = require("src/entities/nourriture");
const nourriture_2 = require("../services/nourriture");
const common_1 = require("@nestjs/common");
let NourritureController = class NourritureController {
    constructor(nourritureService) {
        this.nourritureService = nourritureService;
    }
    create(nourriture) {
        return this.nourritureService.create(nourriture);
    }
    findAll() {
        return this.nourritureService.findAll();
    }
    findById(id) {
        return this.nourritureService.findById(id);
    }
    findByNom(nom) {
        return this.nourritureService.findByNom(nom);
    }
    findByCategorie(categorie) {
        return this.nourritureService.findByCategorie(categorie);
    }
    update(id, nourriture) {
        return this.nourritureService.update(id, nourriture);
    }
    delete(id) {
        return this.nourritureService.delete(id);
    }
};
exports.NourritureController = NourritureController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof nourriture_1.Nourriture !== "undefined" && nourriture_1.Nourriture) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], NourritureController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NourritureController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('/byid/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NourritureController.prototype, "findById", null);
__decorate([
    (0, common_1.Get)('/byname/:nom'),
    __param(0, (0, common_1.Param)('nom')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NourritureController.prototype, "findByNom", null);
__decorate([
    (0, common_1.Get)('/bycategorie/:categorie'),
    __param(0, (0, common_1.Param)('categorie')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NourritureController.prototype, "findByCategorie", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_b = typeof nourriture_1.Nourriture !== "undefined" && nourriture_1.Nourriture) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], NourritureController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NourritureController.prototype, "delete", null);
exports.NourritureController = NourritureController = __decorate([
    (0, common_1.Controller)('nourritures'),
    __metadata("design:paramtypes", [nourriture_2.NourritureService])
], NourritureController);
//# sourceMappingURL=nourriture.js.map