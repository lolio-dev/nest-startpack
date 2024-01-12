import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { User } from '../../auth/decorators/user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { FileScopesEnum } from '../../enums/FileScopes.enum';

@UseGuards(JwtAuthGuard)
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @User() user: UserEntity,
    @Query('scope') scope: FileScopesEnum = FileScopesEnum.None,
  ) {
    return this.filesService.uploadFile(file, user.id, scope);
  }

  @Get()
  getFilesFromUser(
    @User() user: UserEntity,
    @Query('scope') scope: FileScopesEnum = undefined,
  ) {
    return this.filesService.getFilesFromUser(user.id, scope);
  }

  @Delete(':fileURI')
  deleteFile(@Param('fileURI') fileURI: string) {
    return this.filesService.deleteFile(fileURI);
  }

  @Get(':fileId/url')
  getFileUrl(
    @Param('fileId') fileId: string,
    @User() user: UserEntity
  ) {
    return this.filesService.getFileUrl(fileId, user.id)
  }
}
