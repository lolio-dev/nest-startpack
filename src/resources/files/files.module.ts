import { forwardRef, Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { FileEntity } from "./entities/file.entity";
import { UsersService } from "../users/users.service";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([FileEntity]),
    forwardRef(() => UsersModule)
  ],
  providers: [
    FilesService
  ],
  exports: [FilesService],
  controllers: [FilesController]
})
export class FilesModule {}
