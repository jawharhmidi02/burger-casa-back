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
exports.IngredientService = void 0;
const typeorm_1 = require("@nestjs/typeorm");
const ingredient_1 = require("../entities/ingredient");
const typeorm_2 = require("typeorm");
let IngredientService = class IngredientService {
    constructor(ingredientRepository) {
        this.ingredientRepository = ingredientRepository;
    }
    async create(ingredient) {
        try {
            const response = await this.ingredientRepository.save(ingredient);
            return response;
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
    async findAll() {
        try {
            const response = await this.ingredientRepository.find();
            return response;
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
    async findById(id) {
        try {
            const response = await this.ingredientRepository.findOne({ where: { id } });
            return response;
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
    async findByNom(nom) {
        try {
            const response = await this.ingredientRepository.find({ where: { nom: (0, typeorm_2.Like)(`%${nom}%`) } });
            return response;
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
    async update(id, ingredient) {
        try {
            await this.ingredientRepository.update(id, ingredient);
            return this.ingredientRepository.findOne({ where: { id } });
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
    async delete(id) {
        try {
            const response = await this.ingredientRepository.findOne({ where: { id } });
            await this.ingredientRepository.delete(id);
            return response;
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
};
exports.IngredientService = IngredientService;
exports.IngredientService = IngredientService = __decorate([
    __param(0, (0, typeorm_1.InjectRepository)(ingredient_1.Ingredient)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], IngredientService);
//# sourceMappingURL=ingredient.js.map