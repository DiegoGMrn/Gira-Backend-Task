import { Controller,Logger  } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern } from '@nestjs/microservices';



@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);
  constructor(private readonly appService: AppService) {}

  @EventPattern('new_task_created')
  async handleNewTaskCreated(data: { nombre: string,fechaV:string,correo:string,idEquipo:number,idProyecto:number }) {
  const { nombre,fechaV,correo,idEquipo,idProyecto} = data;
  
  if (data) {
    const resp = await this.appService.createTask(data.nombre,data.fechaV,data.correo,data.idEquipo,data.idProyecto)
    return resp;
  } else {
    console.error('Falta INFO.');
  }
  }
  @EventPattern('delete_task')
  async handleDeleteTask(data: { idTask:number,correo:string }) {
  const { idTask,correo} = data;
  
  if (data) {
    const resp = await this.appService.deleteTask(data.idTask,data.correo)
    return resp;
  } else {
    console.error('Falta INFO.');
  }
  }

  @EventPattern('new_taskDescripcion_created')
  async handleNewTaskDescripcionCreated(data: { idTask:number,descripcion:string }) {
  const { idTask , descripcion} = data;
  
  if (data) {
    const resp = await this.appService.createTaskDescripcion(data.idTask,data.descripcion)
    return resp;
  } else {
    console.error('Falta INFO.');
  }
  }

  @EventPattern('new_taskComentary_created')
  async handleNewTaskComentaryCreated(data: { idProyecto:number,idEquipo:number,idTarea:number,comentario:string }) {
  const { idProyecto , idEquipo  ,idTarea,comentario } = data;
  
  if (data) {
    const resp = await this.appService.createTaskComentary(data.idProyecto,data.idEquipo,data.idTarea,data.comentario)
    return resp;
  } else {
    console.error('Falta INFO.');
  }
  }

  @EventPattern('update_task_comentary')
  async handleNewTaskComentaryUpdate(data: { idComentary:number,comentario:string,idTask:number,correo:string }) {
  const { idComentary , comentario ,idTask ,correo } = data;
  console.log(data.comentario)
  if (data) {
    const resp = await this.appService.updateTaskComentary(data.idComentary,data.comentario,data.idTask,data.correo)
    return resp;
  } else {
    console.error('Falta INFO.');
  }
  }

  @EventPattern('delete_comentary')
  async handleDeleteComentary(data: { idComentary:number,correo:string }) {
  const { idComentary,correo} = data;
  
  if (data) {
    const resp = await this.appService.deleteComentary(data.idComentary,data.correo)
    return resp;
  } else {
    console.error('Falta INFO.');
  }
  }
  
  @EventPattern('show_task_project')
  async handleShowTaskProject(data: { idTask: number, correo: string }) {
    const { idTask, correo } = data;

    if (idTask && correo) {
      try {
        const resp = await this.appService.showTaskProject(idTask, correo);
        return resp;
      } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        return null;
      }
    } else {
      console.error('Falta INFO.');
      return null;
    }
  }
  @EventPattern('show_solotask_project')
  async handleShowSoloTaskProject(data: { idProyecto: number, correo: string }) {
    const { idProyecto, correo } = data;

    if (idProyecto && correo) {
      try {
        const resp = await this.appService.showSoloTaskProject(idProyecto, correo);
        return resp;
      } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        return null;
      }
    } else {
      console.error('Falta INFO.');
      return null;
    }
  }



}

