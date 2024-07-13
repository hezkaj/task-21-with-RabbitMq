import { Entity, Column, ManyToOne, ManyToMany, PrimaryColumn, OneToMany, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Project } from 'src/projects/project.entity';
import { stringValue } from 'src/fieldsValues/stringValue.entity';
import { numberValue } from 'src/fieldsValues/numberValue.entity';
import { Task } from 'src/tasks/task.entity';
import { arrayUnique } from 'class-validator';

export enum fieldType{
    string='string',
    number='number',
    enum='enum'
}

@Entity()
export class Field {
    @ApiProperty({example:'1', description:'уникальный идентификатор поля'})
    @PrimaryGeneratedColumn()
    id:number;
    @ApiProperty({example:'поле 1', description:'название поля задачи'})
    @Column()
    name:string;
    @ApiProperty({example:'string', description:'тип поля задачи'})
    @Column({
        type: "enum",
        enum: fieldType,
        default: fieldType.string,
        })
    type:fieldType;
    @ApiProperty({example:'["да", "нет"]', description:'варианты значений поля задач при типе перечисление'})
    @Column('text',{array:true, default:[], nullable:true})
    enum_array:string[]

    @ManyToOne((type)=>Project, (project)=>project.id, {cascade:true, onDelete:'CASCADE'})
    project:Project;

    @OneToMany((type)=>stringValue, (s)=>s.field)
    string:stringValue[]

    @OneToMany((type)=>numberValue, (n)=>n.field)
    number:numberValue[]


}
