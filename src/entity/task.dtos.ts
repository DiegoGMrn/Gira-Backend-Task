import { BeforeInsert, Column, Entity, JoinColumn, OneToMany } from "typeorm";
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

    @Column()
    estado?: boolean;
    
    @OneToMany(() => TaskComentary, taskComentary => taskComentary.task, { cascade: true, onDelete: 'CASCADE' })
    comentarios?: TaskComentary[];
    
    @BeforeInsert()
    setDefaultValues() {
        
        this.estado = false; 
    }
}