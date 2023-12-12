import { Column, Entity, JoinColumn, OneToMany } from "typeorm";
import { TaskComentary } from "./taskComentary.dtos";

@Entity()
export class Task {
    @Column({ primary: true, generated: true })
    id: number;

    @Column()
    name?: string;

    @Column()
    fechaV?: string;

    @Column()
    correoCreador?: string;
    
    @Column()
    descripcion?: string;
    
    @OneToMany(() => TaskComentary, taskComentary => taskComentary.task, { cascade: true, onDelete: 'CASCADE' })
    comentarios?: TaskComentary[];
    
}