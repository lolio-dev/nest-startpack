import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ModelsService } from "./models.service";
import { CreateModelDto } from "./dto/create-model.dto";
import { User } from "../../auth/decorators/user.decorator";
import { UserEntity } from "../users/entities/user.entity";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";

@Controller('models')
@UseGuards(JwtAuthGuard)
export class ModelsController {
  constructor(
    private readonly modelsService: ModelsService
  ) {
  }

  @Post()
  createModel(
    @Body() createModelDto: CreateModelDto,
    @User() user: UserEntity
  ) {
    return this.modelsService.createModel(createModelDto, user)
  }

  @Get()
  getModelsFromUser(
    @User() user: UserEntity
  ) {
    return this.modelsService.getModels(user)
  }

  @Get(':modelId')
  getModelFromId(
    @User() user: UserEntity,
    @Param('modelId') modelId: string
  ) {
    return this.modelsService.getModel(modelId, user);
  }

  @Delete(":modelId")
  deleteModel(
    @Param("modelId") modelId: string,
    @User() user: UserEntity
  ) {
    return this.modelsService.deleteModel(modelId, user);
  }
}
