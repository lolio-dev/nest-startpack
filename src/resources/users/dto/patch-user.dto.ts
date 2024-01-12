import { IsEmail, IsOptional, IsString } from "class-validator";

export class PatchUserDto {
  @IsString()
  @IsOptional()
  username: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  avatar: string;
}
