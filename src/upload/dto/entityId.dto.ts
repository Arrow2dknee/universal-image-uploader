import { IsOptional } from 'class-validator';

export class EntityIdDto {
  @IsOptional()
  readonly entityId: string;
}