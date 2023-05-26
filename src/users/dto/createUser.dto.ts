import { IsNotEmpty, IsOptional, MinLength, MaxLength, Matches, IsEmail } from 'class-validator';

import { ImageMetadataInterface } from '../interfaces';

export class CreateUserDto {
  @MaxLength(25, { message: 'Name cannot exceed 25 characters' })
  @MinLength(3, { message: 'Name should be more than 3 characters' })
  @IsNotEmpty()
  readonly name: string;

  @IsEmail({}, { message: 'Invalid email address format' })
  @IsNotEmpty()
  readonly email: string;

  @IsOptional()
  readonly imageId: string; // Used for associating an image from image dump to user
}