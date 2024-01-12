import { Module } from '@nestjs/common';
import { ModelsController } from './models.controller';
import { ModelsService } from './models.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { ModelEntity } from "./entities/model.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ModelEntity])],
  controllers: [ModelsController],
  providers: [ModelsService]
})
export class ModelsModule {}
