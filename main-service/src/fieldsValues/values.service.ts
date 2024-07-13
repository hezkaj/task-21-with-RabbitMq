import { Repository } from "typeorm";
import { stringValue } from "./stringValue.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { numberValue } from "./numberValue.entity";
import { Task } from "src/tasks/task.entity";
import { Field } from "src/fields/field.entity";
import { enumValue } from "./enumValue.entity";
import { CreateNumberFieldDto, CreateStringFieldDto } from "./values.dto";
import { ValidationException } from "src/validation/validation.exception";

@Injectable()
export class ValuesService {
  constructor(
    @InjectRepository(stringValue)
    private stringsRepository: Repository<stringValue>,

    @InjectRepository(numberValue)
    private numbersRepository: Repository<numberValue>,

    @InjectRepository(enumValue)
    private enumsRepository: Repository<enumValue>
  ) {}
  async createValues(putField:Field[], value, task:Task){
    if (putField.length){
      for (let field of putField){
        if(field.type=='string'){
          let stringDto:CreateStringFieldDto;
          stringDto = value[field.name] 
          await this.stringsRepository.save({
            value:value, task:{id:task.id}, field:{id:field.id}
          })
        }else if(field.type=='number'){
          let numberDto:CreateNumberFieldDto;
          numberDto = value[field.name] 
          await this.numbersRepository.save({
            value:value, task:{id:task.id}, field:{id:field.id}
          })
        } else if(field.type=='enum'){
          if(field.enum_array.includes(value[field.name])){
            let stringDto:CreateStringFieldDto;
            stringDto = value[field.name]
            await this.enumsRepository.save({
              value:value, task:{id:task.id}, field:{id:field.id}
            })
          }else{
            throw new ValidationException({message:'В списке нет этого значения'})
          } 
        } 
      }
    }
  }
  async updateValues(putField:Field[], value, task:Task){
    if (putField.length){
      for (let field of putField){
        if(field.type=='string'){
          let stringDto:CreateStringFieldDto;
          stringDto = value[field.name] 
          const Id= await this.getStringId(task, field)
          await this.stringsRepository.save({
            value:value, task:{id:task.id}, field:{id:field.id}, id:Id.id
          })
        }else if(field.type=='number'){
          let numberDto:CreateNumberFieldDto;
          numberDto = value[field.name] 
          const Id= await this.getNumberId(task, field)
          await this.numbersRepository.save({
            value:value, task:{id:task.id}, field:{id:field.id}, id:Id.id
          })
        } else if(field.type=='enum'){
          if(field.enum_array.includes(value[field.name])){
            let stringDto:CreateStringFieldDto;
            stringDto = value[field.name]
            const Id= await this.getEnumId(task, field)
            await this.enumsRepository.save({
              value:value, task:{id:task.id}, field:{id:field.id}, id:Id.id
            })
          }else{
            throw new ValidationException({message:'В списке нет этого значения'})
          } 
        }  
      }   
    }
  }

  async getEnumId(task:Task, field:Field){
    const en= await this.enumsRepository.findOne({where:
      {task:{id:task.id}, field:{id:field.id}}})
    if(!en){return{id:1}}
    return en
  }
  async getStringId(task:Task, field:Field){
    const st= await this.stringsRepository.findOne({where:
      {task:{id:task.id}, field:{id:field.id}}})
    if(!st){return{id:1}}
    return st
  }
  async getNumberId(task:Task,field:Field ){
    let nu= await this.numbersRepository.findOne({where:
      {task:{id:task.id}, field:{id:field.id}}})
    if(!nu){return{id:1}}
    return nu
  }
  /*
  async getAllValues(task:Task){
    const string =await this.stringsRepository.find({
      where:{task:{id:task.id}},
      relations:{field:true}
    })
    const number =await this.numbersRepository.find({
      where:{task:{id:task.id}},
      relations:{field:true}
    })
    return [string, number]
  }
*/

}