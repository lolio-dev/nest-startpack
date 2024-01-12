import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { ObjmcEntity } from "./entities/objmc.entity";
import { Repository } from "typeorm";
import { CreateUpdateObmjcDto } from "./dto/create-update-obmjc.dto";
import { ObjmcFilesService } from "../../objmc-files/objmc-files.service";
import { lastValueFrom } from "rxjs";
import { FilesService } from "../files/files.service";
import { FileScopesEnum } from "../../enums/FileScopes.enum";
import { ObjmcAdapter } from "./objmc.adapter";
import { FileSourcesEnum } from "../../enums/FileSources.enum";

@Injectable()
export class ObjmcService {
  constructor(
    @InjectRepository(ObjmcEntity)
    private readonly objmcRepository: Repository<ObjmcEntity>,
    private readonly objmcAdapater: ObjmcAdapter,
    private readonly objmcFilesService: ObjmcFilesService,
    private readonly filesService: FilesService,
  ) {
  }

  async updateAndGenerate(objmcId: string, body: CreateUpdateObmjcDto, userId: string) {
    const object = await this.updateObject(body, userId, objmcId);

    const response = await lastValueFrom(this.objmcFilesService.createFile({
      config: this.objmcAdapater.configStateToConfig(object.config),
      textures: await Promise.all(object.textureFiles.map(async file => (await this.filesService.getFileById(file.id, userId)).uri)),
      models: await Promise.all(object.modelFiles.map(async file => (await this.filesService.getFileById(file.id, userId)).uri))
    }));

    if (response) {
      await this.filesService.updateFileById(object.result.id, userId, { uri: response.resultUri });
      await this.filesService.deleteFileFromS3(object.result.uri);

      return {
        logs: response.logs,
        objmcId: object.id
      }
    }
  }

  async createObject(
    body: CreateUpdateObmjcDto,
    userId: string,
  ) {
    const response = await lastValueFrom(this.objmcFilesService.createFile({
      config: this.objmcAdapater.configStateToConfig(JSON.parse(body.config)),
      textures: await Promise.all(body.textures.map(async file => (await this.filesService.getFileById(file, userId)).uri)),
      models: await Promise.all(body.models.map(async file => (await this.filesService.getFileById(file, userId)).uri))
    }));

    if (response) {
      const file = await this.filesService.saveFile(response.resultUri, FileScopesEnum.ObjmcOutput, FileSourcesEnum.S3, userId, body.outputName);

      const objmc = this.objmcRepository.create({
        config: JSON.parse(body.config),
        textureFiles: body.textures.map((texture: string) => ({
          id: texture
        })),
        modelFiles: body.models.map((model: string) => ({
          id: model
        })),
        owner: {
          id: userId
        },
        result: file
      });
      await this.objmcRepository.save(objmc);

      return {
        logs: response.logs,
        objmcId: objmc.id
      }
    }

    throw new InternalServerErrorException("Can't generate files")
  }

  async updateObject(body: CreateUpdateObmjcDto, userId: string, objmcId: string) {
    const config = await this.getObjectById(objmcId, userId);

    Object.assign(config, {
      config: JSON.parse(body.config),
      textureFiles: body.textures.map((texture: string) => ({
        id: texture
      })),
      modelFiles: body.models.map((model: string) => ({
        id: model
      })),
    })

    return await this.objmcRepository.save(config);
  }

  async getObjectById(objectId: string, userId: string) {
    const config = await this.objmcRepository.findOne({
      where: {
        owner: {
          id: userId
        },
        id: objectId
      },
      relations: ["result", "textureFiles", "modelFiles"]
    });

    if (!config) {
      throw new NotFoundException("Unable to find object")
    }

    return config
  }


  async getUrlForObject(objmcId: string, userId: string) {
    const object = await this.getObjectById(objmcId, userId);

    return this.filesService.getFileUrl(object.result.id, userId);
  }
}
