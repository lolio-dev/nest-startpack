import { ArrayMinSize, IsArray, IsJSON, IsString } from "class-validator";

export class CreateUpdateObmjcDto {
  @IsJSON()
  config: string

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  textures: string[]

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  models: string[]

  @IsString()
  outputName: string;
}
