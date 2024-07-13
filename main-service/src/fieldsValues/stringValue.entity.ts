import { Field } from 'src/fields/field.entity';
import { Task } from 'src/tasks/task.entity';
import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
@Entity()
export class stringValue{
    @ApiProperty({example:'текстовое значение',description:'значение поля задачи'})
    @Column()
    value:string
    @ManyToOne((type)=>Field, (f)=>f.name, {cascade:true, onDelete:'CASCADE'})
    field:Field
    @ApiProperty({example:'1', description:'уникальный идентификатор значения'})
    @PrimaryGeneratedColumn()
    id:number;
    @ManyToOne((type)=>Task, (t)=>t.id, {cascade:true, onDelete:'CASCADE'})
    task:Task
}