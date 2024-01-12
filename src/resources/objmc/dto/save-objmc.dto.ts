import { ArrayMinSize, IsArray, IsJSON, IsString, IsUrl } from "class-validator";

export class SaveObjmcDto {
  @IsJSON()
  config: Record<any, any>

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  textures: string[]

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  models: string[]

  @IsString()
  @IsUrl()
  resultURI: string
}
