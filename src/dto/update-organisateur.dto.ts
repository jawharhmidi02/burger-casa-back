import { PartialType } from '@nestjs/mapped-types';
import { CreateOrganisateurDto } from './create-organisateur.dto';

export class UpdateOrganisateurDto extends PartialType(CreateOrganisateurDto) {
    password: string;
}
