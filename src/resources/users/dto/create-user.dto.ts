import { OmitType } from '@nestjs/mapped-types';
import { UserDto } from './user.dto';
import { IsEmail, IsOptional, IsString } from "class-validator";
import { AuthProviders } from "../../../enums/AuthProviders.enum";

export class CreateUserDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  authProvider: AuthProviders;
}
