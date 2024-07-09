"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IngredientModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const ingredient_1 = require("../entities/ingredient");
const ingredient_2 = require("../services/ingredient");
const ingredient_3 = require("../controllers/ingredient");
let IngredientModule = class IngredientModule {
};
exports.IngredientModule = IngredientModule;
exports.IngredientModule = IngredientModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([ingredient_1.Ingredient])],
        providers: [ingredient_2.IngredientService],
        controllers: [ingredient_3.IngredientController],
        exports: [ingredient_2.IngredientService],
    })
], IngredientModule);
//# sourceMappingURL=ingredient.js.map