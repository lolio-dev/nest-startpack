import { IsString } from "class-validator";

export class CreateModelDto {
  @IsString()
  objmcId: string;

  @IsString()
  name: string;
}