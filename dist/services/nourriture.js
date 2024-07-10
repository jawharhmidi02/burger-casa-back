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
exports.NourritureService = void 0;
const typeorm_1 = require("typeorm");
const nourriture_1 = require("src/entities/nourriture");
const common_1 = require("@nestjs/common");
const typeorm_2 = require("@nestjs/typeorm");
let NourritureService = class NourritureService {
    constructor(nourritureRepository) {
        this.nourritureRepository = nourritureRepository;
    }
    async create(nourriture) {
        try {
            const response = await this.nourritureRepository.save(nourriture);
            return response;
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
    async findAll() {
        try {
            const response = await this.nourritureRepository.find({
                relations: ['ingredients']
            });
            return response;
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
    async findById(id) {
        try {
            const response = await this.nourritureRepository.findOne({
                where: { id },
                relations: ["ingredients"]
            });
            return response;
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
    async findByNom(nom) {
        try {
            const response = await this.nourritureRepository.find({
                where: { nom: (0, typeorm_1.Like)(`%${nom}%`) },
                relations: ["ingredients"]
            });
            return response;
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
    async findByCategorie(categorie) {
        try {
            const response = await this.nourritureRepository.find({
                where: { categorie: (0, typeorm_1.Like)(`%${categorie}%`) },
                relations: ["ingredients"]
            });
            return response;
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
    async update(id, nourriture) {
        try {
            if (nourriture.ingredients && nourriture.ingredients.length != 0) {
                const response = await this.nourritureRepository.findOne({
                    where: { id },
                    relations: ["ingredients"]
                });
                Object.assign(response, nourriture);
                return await this.nourritureRepository.save(response);
            }
            await this.nourritureRepository.update(id, nourriture);
            const response = await this.nourritureRepository.findOne({
                where: { id },
                relations: ["ingredients"]
            });
            return response;
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
    async delete(id) {
        try {
            const response = await this.nourritureRepository.findOne({
                where: { id },
                relations: ["ingredients"]
            });
            await this.nourritureRepository.delete(id);
            return response;
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
};
exports.NourritureService = NourritureService;
exports.NourritureService = NourritureService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(nourriture_1.Nourriture)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], NourritureService);
//# sourceMappingURL=nourriture.js.map