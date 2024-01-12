import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './resources/users/users.module';
import { ConfigModule } from "@nestjs/config";
import { ObjmcFilesModule } from './objmc-files/objmc-files.module';
import { FilesModule } from './resources/files/files.module';
import { ObjmcModule } from './resources/objmc/objmc.module';
import { ModelsModule } from './resources/models/models.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    ObjmcFilesModule,
    FilesModule,
    ObjmcModule,
    ModelsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
