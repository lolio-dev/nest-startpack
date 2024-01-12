import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  GetObjectCommand,
  PutObjectCommand,
  PutObjectCommandInput,
  PutObjectCommandOutput,
  DeleteObjectCommandOutput,
  S3Client, DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from './entities/file.entity';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { UsersService } from '../users/users.service';
import { FileScopesEnum } from '../../enums/FileScopes.enum';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { FileSourcesEnum } from "../../enums/FileSources.enum";

@Injectable()
export class FilesService {
  private logger = new Logger(FilesService.name);
  private readonly s3: S3Client;
  private readonly region: string;
  private readonly bucket: string;

  constructor(
    @InjectRepository(FileEntity)
    private readonly filesRespository: Repository<FileEntity>,
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {
    this.region = configService.get('AWS_REGION');
    this.bucket = this.configService.get<string>('S3_BUCKET');
    this.s3 = new S3Client({
      region: this.region,
      endpoint: configService.get('S3_ENDPOINT'),
      forcePathStyle: true,
      credentials: {
        accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    userId: string,
    scope: FileScopesEnum,
  ) {
    const fileUri = uuid();

    const input: PutObjectCommandInput = {
      Body: file.buffer,
      Bucket: this.bucket,
      Key: fileUri,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };

    try {
      const response: PutObjectCommandOutput = await this.s3.send(
        new PutObjectCommand(input),
      );
      if (response.$metadata.httpStatusCode === 200) {
        await this.saveFile(fileUri, scope, FileSourcesEnum.S3, userId, file.originalname)

        return {
          uri: fileUri,
        };
      } else {
        throw new InternalServerErrorException("CANT_SAVE_TO_S3");
      }
    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException("CANT_SAVE_TO_S3");
    }
  }

  async saveFile(
    fileUri: string,
    scope: FileScopesEnum,
    source: FileSourcesEnum,
    owner: string,
    fileName?: string,
  ) {
    const file = this.filesRespository.create({
      uri: fileUri,
      name: fileName,
      owner: {
        id: owner,
      },
      scope,
      source
    })

    return this.filesRespository.save(file)
  }

  async getFilesFromUser(userId: string, scope?: FileScopesEnum) {
    const user = await this.usersService.findUser(userId);
    return await this.filesRespository.findBy({
      owner: { id: user.id },
      scope: scope ?? null,
    });
  }

  deleteFile(fileId: string) {
    return this.filesRespository.delete(fileId);
  }

  async getFileUrl(fileId: string, userId: string) {
    const file = await this.getFileById(fileId, userId);

    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: file.uri
    });

    return await getSignedUrl(this.s3, command, {
      expiresIn: 3600,
    })
  }

  async getFileById(fileId: string, userId: string) {
    const file = await this.filesRespository.findOneBy({
      owner: { id: userId },
      id: fileId
    });

    if (!file) {
      throw new NotFoundException("Unable to find find");
    }

    return file
  }

  async updateFileById(fileId: string, userId: string, newFile: Partial<FileEntity>) {
    const file = await this.getFileById(fileId, userId);

    return this.filesRespository.update(fileId, newFile);
  }

  async deleteFileFromS3(fileURI: string) {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: fileURI
    });

    try {
      const response: DeleteObjectCommandOutput = await this.s3.send(command);
    } catch (e) {
      throw new InternalServerErrorException("Can't delete s3 file")
    }
  }
}
