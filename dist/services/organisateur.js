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
exports.OrganisateurService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const organisateur_1 = require("../entities/organisateur");
let OrganisateurService = class OrganisateurService {
    constructor(organisateurRepository) {
        this.organisateurRepository = organisateurRepository;
    }
    async create(organisateur) {
        try {
            const response = await this.organisateurRepository.save(organisateur);
            return response;
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
    async findAll() {
        try {
            const response = await this.organisateurRepository.find();
            return response;
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
    async findOne(id) {
        try {
            const response = await this.organisateurRepository.findOne({ where: { id } });
            return response;
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
    async update(id, organisateur) {
        try {
            await this.organisateurRepository.update(id, organisateur);
            return this.organisateurRepository.findOne({ where: { id } });
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
    async remove(id) {
        try {
            const response = await this.organisateurRepository.findOne({ where: { id } });
            await this.organisateurRepository.delete(id);
            return response;
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
};
exports.OrganisateurService = OrganisateurService;
exports.OrganisateurService = OrganisateurService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(organisateur_1.Organisateur)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], OrganisateurService);
//# sourceMappingURL=organisateur.js.map