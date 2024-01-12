import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { CreateUpdateObmjcDto } from "./dto/create-update-obmjc.dto";
import { ObjmcService } from "./objmc.service";
import { User } from "../../auth/decorators/user.decorator";
import { UserEntity } from "../users/entities/user.entity";

@Controller('objmc')
@UseGuards(JwtAuthGuard)
export class ObjmcController {
  constructor(
    private readonly objmcService: ObjmcService,
  ) {
  }

  @Post()
  createObject(
    @Body() createObjmcDto: CreateUpdateObmjcDto,
    @User() user: UserEntity,
  ) {
    return this.objmcService.createObject(createObjmcDto, user.id);
  }

  @Get(":objmcId/url")
  getResultUrl(
    @User() user: UserEntity,
    @Param("objmcId") objmcId: string
  ) {
    return this.objmcService.getUrlForObject(objmcId, user.id)
  }

  @Patch(":objmcId")
  updateObject(
    @User() user: UserEntity,
    @Param("objmcId") objmcId: string,
    @Body() updateObjmcDto: CreateUpdateObmjcDto
  ) {
    return this.objmcService.updateObject(updateObjmcDto, user.id, objmcId);
  }

  @Patch(":objmcId/generate")
  updateAndGenerateObject(
    @User() user: UserEntity,
    @Param("objmcId/generate") objmcId: string,
    @Body() updateObjmcDto: CreateUpdateObmjcDto
  ) {
    return this.objmcService.updateAndGenerate(objmcId, updateObjmcDto, user.id);
  }
}
