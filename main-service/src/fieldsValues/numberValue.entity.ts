import { Field } from 'src/fields/field.entity';
import { Task } from 'src/tasks/task.entity';
import { Entity, Column, ManyToOne, PrimaryGeneratedColumn,  } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
@Entity()
export class numberValue{
    @ApiProperty({example:'10',description:'значение поля задачи'})
    @Column()
    value:number;
    @ApiProperty({example:'1', description:'уникальный идентификатор значения'})
    @PrimaryGeneratedColumn()
    id:number;
    @ManyToOne((type)=>Field, (f)=>f.id, {cascade:true, onDelete:'CASCADE'})
    field:Field

    @ManyToOne((type)=>Task, (t)=>t.id, {cascade:true, onDelete:'CASCADE'})
    task:Task
}