import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { ObjmcResultDto } from "../resources/objmc/dto/objmc-result.dto";
import { ObjmcConfig } from "../types/ObjmcConfig";

@Injectable()
export class ObjmcFilesService {

  constructor(
    @Inject('OBJMC_FILES_MICROSERVICE') private objmcfilesMicroservice: ClientProxy,
  ) {}

  createFile(config: {
    models: string[],
    textures: string[],
    config: ObjmcConfig
  }): Observable<ObjmcResultDto> {
    return this.objmcfilesMicroservice.send({
      cmd: 'create-files'
    }, {
      "objmcConfig": config
    })
  }
}
