import { Column, Entity, JoinColumn, ManyToOne} from "typeorm"
import { Task } from "./task.dtos";

@Entity()
export class TaskComentary{
    @Column({ primary: true, generated: true })
    idComentary: number;

    @Column()
    idProyecto?: number;

    @Column()
    idEquipo?: number;

    @Column()
    idTarea?: number;

    @Column({ nullable: true })
    comentario?: string;

    @Column({ nullable: true })
    correoCreador?: string;
    
    @ManyToOne(() => Task, task => task.comentarios, { onDelete: 'CASCADE' })
    @JoinColumn({ name: "idTarea" })
    task?: Task;
    
}