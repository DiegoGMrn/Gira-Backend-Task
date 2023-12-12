import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from '@nestjs/common'
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'task_queue',
      queueOptions: {
        durable: false,
      },
    },
  });
  await app.listen();
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist:true,
    forbidNonWhitelisted:true,
    transform:true,
    })
    
  )

  //dsadas
  //await app.listen(3000);
}
bootstrap();
