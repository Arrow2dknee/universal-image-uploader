import { IsNotEmpty } from 'class-validator';

export class UserIdDto {
  @IsNotEmpty()
  readonly id: string;
}