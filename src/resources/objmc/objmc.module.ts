import { Module } from '@nestjs/common';
import { ObjmcController } from './objmc.controller';
import { ObjmcService } from './objmc.service';
import { ObjmcFilesModule } from "../../objmc-files/objmc-files.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ObjmcEntity } from "./entities/objmc.entity";
import { FilesModule } from "../files/files.module";
import { ObjmcAdapter } from "./objmc.adapter";

@Module({
  imports: [
    TypeOrmModule.forFeature([ObjmcEntity]),
    ObjmcFilesModule,
    FilesModule
  ],
  controllers: [ObjmcController],
  providers: [ObjmcService, ObjmcAdapter]
})
export class ObjmcModule {}
