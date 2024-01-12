import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateModelDto } from "./dto/create-model.dto";
import { Repository } from "typeorm";
import { ModelEntity } from "./entities/model.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../users/entities/user.entity";

@Injectable()
export class ModelsService {
  constructor(
    @InjectRepository(ModelEntity)
    private readonly modelsRepository: Repository<ModelEntity>
  ) {
  }

  createModel(createModelDto: CreateModelDto, user: UserEntity) {
    const model = this.modelsRepository.create({
      owner: user,
      objmc: {
        id: createModelDto.objmcId
      },
      name: createModelDto.name
    })

    return this.modelsRepository.save(model)
  }

  getModels(user: UserEntity) {
    return this.modelsRepository.findBy({
      owner: user
    })
  }

  async getModel(modelId: string, user: UserEntity) {
    const model = await this.modelsRepository.findOne({
      where: { id: modelId, owner: user },
      relations: ['objmc', 'objmc.textureFiles', 'objmc.modelFiles']
    });

    if (!model) {
      throw new NotFoundException("Unable to find model")
    }

    return model
  }

  async deleteModel(modelId: string, user: UserEntity) {
    return this.modelsRepository.delete({
      id: modelId,
      owner: user,
    })
  }
}
