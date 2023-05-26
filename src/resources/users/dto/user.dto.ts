import { IsString, IsUUID } from 'class-validator';

export class UserDto {
  @IsUUID()
  id: string;

  @IsString()
  password: string;
}
