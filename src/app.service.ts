import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices'

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { JwtService } from '@nestjs/jwt';

import { TaskComentary } from './entity/taskComentary.dtos';

import { Task } from './entity/task.dtos';
@Injectable()
export class AppService {
  constructor(@Inject('TASK_SERVICE') private client: ClientProxy,
  @InjectRepository(Task) private readonly taskRepository: Repository<Task>,private readonly jwtService: JwtService,
  
  @InjectRepository(TaskComentary) private readonly taskComentaryRepository: Repository<TaskComentary>){}

  
  async createTask(nombre:string,fechaV:string,correo:string,idEquipo:number,idProyecto:number): Promise<boolean> {
    
    const task = new Task();
    task.name = nombre;
    task.fechaV = fechaV;
    task.correoCreador=correo;
    task.descripcion="";
    //task.idEquipo=idEquipo;aa
    //task.idProyecto=idProyecto;
    await this.taskRepository.save(task);
    
    const taskComentary = new TaskComentary();
    taskComentary.idProyecto=idProyecto;
    taskComentary.idEquipo=idEquipo;
    taskComentary.idTarea=task.id;
    await this.taskComentaryRepository.save(taskComentary);
    return true;
  }

  async deleteTask(idTask: number, correo: string): Promise<boolean> {
    try {
        
        const tareaBuscada = await this.taskRepository.findOne({ where: { id: idTask } });

        
        if (!tareaBuscada) {
            console.error("No se encontró la tarea con el ID proporcionado.");
            return false;
        }

        
        if (tareaBuscada.correoCreador !== correo) {
            console.error("El correo proporcionado no coincide con el creador de la tarea.");
            return false;
        }

        
        await this.taskRepository.remove(tareaBuscada);

        return true;
    } catch (error) {
        console.error("Error al eliminar la tarea:", error);
        return false;
    }
}

  async createTaskDescripcion(idTask: number, descripcion: string): Promise<boolean> {
    try {
        const tareaBuscada = await this.taskRepository.findOne({ where: { id: idTask } });
        if (!tareaBuscada) {
            console.error("No se encontró la tarea con el ID proporcionado.");
            return false;
        }
        tareaBuscada.descripcion = descripcion;
        await this.taskRepository.save(tareaBuscada);
        return true;
    } catch (error) {
        console.error("Error al actualizar la descripción de la tarea:", error);
        return false;
    }
  }
  async createTaskComentary(idProyecto:number,idEquipo:number,idTarea:number,comentario:string): Promise<boolean> {
    
    const taskComentary = new TaskComentary();
    taskComentary.idProyecto=idProyecto;
    taskComentary.idEquipo=idEquipo;
    taskComentary.idTarea=idTarea;
    taskComentary.comentario=comentario;
    await this.taskComentaryRepository.save(taskComentary);
    return true;
  }
  async updateTaskComentary(idComentary: number, comentario: string, idTask: number, correo: string): Promise<boolean> {
    try {
        
        const tareaBuscada = await this.taskRepository.findOne({ where: { id: idTask } });

        
        if (!tareaBuscada) {
            console.error("No se encontró la tarea con el ID proporcionado.");
            return false;
        }

        
        if (tareaBuscada.correoCreador !== correo) {
            console.error("El correo proporcionado no coincide con el creador de la tarea.");
            return false;
        }

        
        const comentarioBuscado = await this.taskComentaryRepository.findOne({ where: { idComentary: idComentary } });

        
        comentarioBuscado.comentario = comentario;
        await this.taskComentaryRepository.save(comentarioBuscado);

        return true;
    } catch (error) {
        console.error("Error al actualizar el comentario:", error);
        return false;
    }
}

async deleteComentary(idComentary: number, correo: string): Promise<boolean> {
    try {
        const comentarioBuscado = await this.taskComentaryRepository.findOne({ where: { idComentary: idComentary } });
        const idTaskDelComentario = comentarioBuscado.idTarea;
        const tareaBuscada = await this.taskRepository.findOne({ where: { id: idTaskDelComentario } });

        

        
        if (!comentarioBuscado) {
            console.error("No se encontró el comentario con el ID proporcionado.");
            return false;
        }

        
        if (tareaBuscada.correoCreador !== correo || comentarioBuscado.correoCreador !== correo) {
            console.error("El correo proporcionado no coincide con el creador de la tarea o el creador del comentario.");
            return false;
        }

        
        await this.taskComentaryRepository.remove(comentarioBuscado);

        return true;
    } catch (error) {
        console.error("Error al eliminar la tarea:", error);
        return false;
    }
}

    
    async showTaskProject(idTask: number, correo: string): Promise<{ taskName: string, fechaVencimiento: string, descripcion: string, idDelEquipo: number, comentarios: { idComentario: number, contenido: string, correoCreador: string }[] }[] | null> {
        try {
            // Obtener todos los comentarios asociados al proyecto desde TaskComentary
            const comentarios = await this.taskComentaryRepository.find({
                where: { idTarea: idTask },
                relations: ['task'],
            });
    
            if (!comentarios || comentarios.length === 0) {
                console.error("No se encontraron tareas para el proyecto con ID", idTask);
                return null;
            }
    
            const projectDetailsMap: Map<number, { taskName: string, fechaVencimiento: string, descripcion: string, idDelEquipo: number, comentarios: { idComentario: number, contenido: string, correoCreador: string }[] }> = new Map();
    
                            // Iterar sobre los comentarios encontrados
                for (const comentario of comentarios) {
                    const tarea = comentario.task; // Obtener la tarea asociada al comentario

                    if (!tarea || tarea.correoCreador !== correo) {
                        console.error(`La tarea asociada al comentario con ID ${comentario.idComentary} no se encontró o el correo no coincide.`);
                        continue;
                    }

                    // Obtener o inicializar los detalles de la tarea
                    let taskDetails = projectDetailsMap.get(tarea.id);

                    if (!taskDetails) {
                        taskDetails = {
                            taskName: tarea.name,
                            fechaVencimiento: tarea.fechaV,
                            descripcion: tarea.descripcion || 'Sin descripción.',
                            idDelEquipo: comentario.idEquipo || 0, // Usar el idEquipo desde TaskComentary
                            comentarios: [],
                        };
                        projectDetailsMap.set(tarea.id, taskDetails);
                    }

                    // Agregar directamente los comentarios del comentario actual a los detalles
                    taskDetails.comentarios.push({
                        idComentario: comentario.idComentary,
                        contenido: comentario.comentario,
                        correoCreador: comentario.correoCreador || ''
                    });
                }

    
            // Convertir el mapa de detalles a un array para la salida
            const projectDetails = Array.from(projectDetailsMap.values());
    
            console.log(JSON.stringify(projectDetails, null, 2));
    
            return projectDetails;
        } catch (error) {
            console.error("Error al mostrar los detalles de las tareas del proyecto:", error);
            return null;
        }
    }
    async showSoloTaskProject(idProyecto: number, correo: string): Promise<{ taskName: string;taskId: number;estado:boolean }[] | null> {
        try {
            const comentarios = await this.taskComentaryRepository.find({
                where: { idProyecto: idProyecto },
                relations: ['task'],
            });
    
            if (!comentarios || comentarios.length === 0) {
                return null;
            }
    
            const projectDetails: { taskName: string; taskId: number;estado:boolean }[] = [];
    
            for (const comentario of comentarios) {
                const tarea = comentario.task;
    
                if (!tarea || tarea.correoCreador !== correo) {
                    continue;
                }
    
                const existingTask = projectDetails.find(task => task.taskId === tarea.id);
    
                if (!existingTask) {
                    const taskDetails: { taskName: string; taskId: number;estado:boolean } = {
                        taskName: tarea.name,
                        taskId: tarea.id,
                        estado: tarea.estado
                        
                    };
    
                    projectDetails.push(taskDetails);
                }
            }
            console.log(projectDetails)
            return projectDetails;
        } catch (error) {
            console.error("Error al mostrar los detalles de las tareas del proyecto:", error);
            return null;
        }
    }
    
    async updateTaskState(idTarea: number,correo: string): Promise<boolean> {
        const tareaBuscada = await this.taskRepository.findOne({ where: { id:idTarea } });
        if(tareaBuscada){
            tareaBuscada.estado=true;
            return true
        }
        return false
    }

    async updateTaskName(idTarea: number,nuevoNombre:string,correo: string): Promise<boolean> {
        const tareaBuscada = await this.taskRepository.findOne({ where: { id:idTarea } });
        if(tareaBuscada){
            tareaBuscada.name=nuevoNombre;
            return true
        }
        return false
    }
  }
