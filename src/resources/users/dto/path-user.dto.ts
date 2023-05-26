import { OmitType } from '@nestjs/mapped-types';
import { UserDto } from './user.dto';

export class PatchUserDto extends OmitType(UserDto, [
  'id',
  'password',
] as const) {}
