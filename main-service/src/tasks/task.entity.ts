import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToMany} from 'typeorm';
import { Column_ } from 'src/columns/column_.entity';
import { ApiProperty } from '@nestjs/swagger';
import { stringValue } from 'src/fieldsValues/stringValue.entity';
import { numberValue } from 'src/fieldsValues/numberValue.entity';
import { enumValue } from 'src/fieldsValues/enumValue.entity';
@Entity()
export class Task {
  @ApiProperty({example:'1', description:'уникальный идентификатор задачи'})
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty({example:'задача', description:'название задачи'})
  @Column()
  name: string;
  @ApiProperty({example:'сложная задача', description:'описание задачи'})
  @Column({default:''})
  description: string;
  @ApiProperty({example:'2024.01.01:00.00.00', description:'время создания задачи'})
  @CreateDateColumn()
  time_create: string;  

  @ApiProperty({example:'1', description:'положение задачи внутри столбца'})
  @Column()
  pozition: number;

  @ManyToOne((type)=>Column_, (column)=>column.id, {cascade:true, onDelete:'CASCADE'})
  column:Column_;

  @OneToMany((type)=>stringValue, (sv)=>sv.task)
  string_values:stringValue[];

  @OneToMany((type)=>numberValue, (nv)=>nv.task)
  number_values:numberValue[];

  @OneToMany((type)=>enumValue, (ev)=>ev.task)
  enum_values:enumValue[];


}