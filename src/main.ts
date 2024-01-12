import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { config } from 'aws-sdk';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  const configService = app.get(ConfigService);

  const user = configService.get('RABBIT_USER')
  const password = configService.get('RABBIT_PASSWORD')
  const host = configService.get('RABBIT_HOST')
  const port = configService.get('RABBIT_PORT')
  const queueName = configService.get('RABBIT_QUEUE')

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${user}:${password}@${host}:${port}`],
      queue: queueName,
      queueOptions: {
        durable: true
      }
    }
  });

  await app.startAllMicroservices()
  await app.listen(configService.get('NEST_PORT') || 3000);
}

bootstrap();
