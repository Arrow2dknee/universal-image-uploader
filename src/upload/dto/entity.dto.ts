import { IsNotEmpty, IsEnum } from 'class-validator';

import { EntityEnum } from '../enums/entity.enum';

export class EntityDto {
  @IsNotEmpty()
  @IsEnum(EntityEnum, { message: 'Entity does not match with available entities' })
  readonly entity: EntityEnum;
}