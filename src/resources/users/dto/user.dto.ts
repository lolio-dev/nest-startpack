import { IsEmail, IsOptional, IsString, IsUUID } from 'class-validator';
import { AuthProviders } from "../../../enums/AuthProviders.enum";

export interface UserDto {
  id: string;
  email: string;
  username: string;
  avatar: string;
}