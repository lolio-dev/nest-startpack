import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserEntity } from '../resources/users/entities/user.entity';
import { FileEntity } from "../resources/files/entities/file.entity";
import { ObjmcEntity } from "../resources/objmc/entities/objmc.entity";
import { ModelEntity } from "../resources/models/entities/model.entity";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return ({
          type: 'postgres',
          host: configService.get<string>('DATABASE_HOST'),
          port: configService.get<number>('DATABASE_PORT'),
          username: configService.get<string>('DATABASE_USERNAME'),
          password: configService.get<string>('DATABASE_PASSWORD'),
          database: configService.get('DATABASE_NAME'),
          entities: [UserEntity, FileEntity, ObjmcEntity, ModelEntity],
          synchronize: configService.get<string>('NODE_ENV') === 'development',
        });
      },
    }),
  ],
})
export class DatabaseModule {}
