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
Object.defineProperty(exports, "__esModule", { value: true });
exports.IngredientController = void 0;
const ingredient_1 = require("../services/ingredient");
const ingredient_2 = require("../entities/ingredient");
const common_1 = require("@nestjs/common");
let IngredientController = class IngredientController {
    constructor(ingredientService) {
        this.ingredientService = ingredientService;
    }
    create(ingredient) {
        return this.ingredientService.create(ingredient);
    }
    findAll() {
        return this.ingredientService.findAll();
    }
    findById(id) {
        return this.ingredientService.findById(id);
    }
    findByNom(nom) {
        return this.ingredientService.findByNom(nom);
    }
    update(id, ingredient) {
        return this.ingredientService.update(id, ingredient);
    }
    delete(id) {
        return this.ingredientService.delete(id);
    }
};
exports.IngredientController = IngredientController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ingredient_2.Ingredient]),
    __metadata("design:returntype", Promise)
], IngredientController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], IngredientController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('/byid/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IngredientController.prototype, "findById", null);
__decorate([
    (0, common_1.Get)('/byname/:nom'),
    __param(0, (0, common_1.Param)('nom')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IngredientController.prototype, "findByNom", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ingredient_2.Ingredient]),
    __metadata("design:returntype", Promise)
], IngredientController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IngredientController.prototype, "delete", null);
exports.IngredientController = IngredientController = __decorate([
    (0, common_1.Controller)('ingredients'),
    __metadata("design:paramtypes", [ingredient_1.IngredientService])
], IngredientController);
//# sourceMappingURL=ingredient.js.map