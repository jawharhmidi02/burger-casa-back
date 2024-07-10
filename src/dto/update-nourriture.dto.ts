import { PartialType } from '@nestjs/mapped-types';
import { CreateNourritureDto } from './create-nourriture.dto';

export class UpdateNourritureDto extends PartialType(CreateNourritureDto) {}
