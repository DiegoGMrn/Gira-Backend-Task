import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Transport, ClientsModule } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtModule } from '@nestjs/jwt'; // Asegúrate de importar JwtModule



import { Task } from './entity/task.dtos';
import { TaskComentary } from './entity/taskComentary.dtos';


@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'TASK_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'task_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'silly.db.elephantsql.com',
      port: 5432,
      username: 'leungvxu',
      password: 's4sPu0JHsCstv4zW2ZeFQLAs6DjRgAnj',
      database: 'leungvxu',
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Task,TaskComentary]),
    JwtModule.register({
      secret: 'tu_clave_secreta', // Remplaza con tu clave secreta real
      signOptions: { expiresIn: '1h' }, // Opciones de firma del token
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}