import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ClientProxyFactory, Transport } from "@nestjs/microservices";
import { ObjmcFilesService } from './objmc-files.service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'OBJMC_FILES_MICROSERVICE',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const user = configService.get('RABBIT_USER')
        const password = configService.get('RABBIT_PASSWORD')
        const host = configService.get('RABBIT_HOST')
        const port = configService.get('RABBIT_PORT')
        const queueName = configService.get('RABBIT_QUEUE')

        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [`amqp://${user}:${password}@${host}:${port}`],
            queue: queueName,
            queueOptions: {
              durable: true
            }
          }
        })
      }
    },
    ObjmcFilesService
  ],
  exports: [ObjmcFilesService]
})
export class ObjmcFilesModule {}
