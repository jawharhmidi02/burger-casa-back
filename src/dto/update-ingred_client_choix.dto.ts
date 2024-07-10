import { PartialType } from '@nestjs/mapped-types';
import { CreateIngredClientChoixDto } from './create-ingred_client_choix.dto';

export class UpdateIngredClientChoixDto extends PartialType(CreateIngredClientChoixDto) {}
