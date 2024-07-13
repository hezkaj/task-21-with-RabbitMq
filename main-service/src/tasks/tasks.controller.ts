import { Body, Controller, Param, Post, UseGuards, UsePipes, Request, Get, Delete, Put, Patch, Headers } from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { ProjectsService } from "src/projects/projects.service";
import { ColumnsService } from "src/columns/columns.service";
import { ValidationPipe } from "src/validation/validation.pipe";
import { CreateTaskDto } from "./task.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Task } from "./task.entity";
import { FieldsService } from "src/fields/fields.service";
import { ValuesService } from "src/fieldsValues/values.service";
import { CreaterService } from "src/creater/creater.service";
import { AuthGuard } from "@nestjs/passport";
import { Project } from "src/projects/project.entity";

@ApiTags('действия с задачами')
@Controller('task/:user_id/:project_id/:column_id')
export class TasksController{
    constructor(
        private projectService: ProjectsService,
        private taskService: TasksService,
        private columnService: ColumnsService,
        private fieldService:FieldsService,
        private valuesService: ValuesService,
        private createrService:CreaterService
    ){}
    @ApiOperation({summary:'Создание задачи'})
    @ApiResponse({status:200, type:Promise<Task>})
    @UseGuards(AuthGuard('jwt'))
    @UsePipes(ValidationPipe)
    @Post('/')
    async createTask(@Request() req, @Body() taskDto:CreateTaskDto, @Param() param,
      @Body()value):Promise<Task>{
        const project = await this.findParent(req,param)
        const column =await this.columnService.getOneColumn(project,param)
        const task = await this.taskService.createTask( taskDto, column,)
        const putField= await this.fieldService.getAllField(project)
        await this.valuesService.createValues(putField, value, task)
        return await this.taskService.getOneTask(column, param)
    }

    @ApiOperation({summary:'Получение всех задач проекта'})//////
    @ApiResponse({status:200, type:Promise<Task[]>})
    @UseGuards(AuthGuard('jwt'))
    @Get('/tasks')
    async getTasksOfColumn(@Request() req, @Param() param):Promise<Task[]>{
        const project = await this.findParent(req,param)
        const column =await this.columnService.getOneColumn(project,param)
        return await this.taskService.getTasksOfColumn(column)
    }
    @ApiOperation({summary:'Получение задачи по айди'})
    @ApiResponse({status:200, type:Promise<Task>})
    @UseGuards(AuthGuard('jwt'))
    @Get('/:task_id')
    async getOneTask(@Request() req, @Param() param):Promise<Task>{
        const project = await this.findParent(req,param)
        const column =await this.columnService.getOneColumn(project,param)
        return await this.taskService.getOneTask(column, param)
    }
    @ApiOperation({summary:'Удаление задачи по айди'})
    @ApiResponse({status:200, type:Promise<boolean>})
    @UseGuards(AuthGuard('jwt'))
    @Delete('/:task_id')
    async deleteTask(@Request() req, @Param() param):Promise<boolean>{
        const project = await this.findParent(req,param)
        const column =await this.columnService.getOneColumn(project,param)
        return await this.taskService.deleteTask(column, param)
    }
    @ApiOperation({summary:'Изменение положения задачи внутри проекта по айди'})//////
    @ApiResponse({status:200, type:Array})
    @UseGuards(AuthGuard('jwt'))
    @Patch('/:task_id')
    async repozTask(@Request() req, @Body() body, @Param() param):Promise<any>{
        const project = await this.findParent(req,param)
        const column =await this.columnService.getOneColumn(project,param)
        return await this.taskService.repozTask(column,param,body)
    }
    @ApiOperation({summary:'Изменение задачи по айди'})
    @ApiResponse({status:200, type:Promise<Task>})
    @UseGuards(AuthGuard('jwt'))
    @Put('/:task_id')
    async updateTask(@Request() req, @Body() taskDto:CreateTaskDto, @Param() param,
      @Body()value):Promise<Task>{
        const project = await this.findParent(req,param)
        const column =await this.columnService.getOneColumn(project,param)
        const task= await this.taskService.updateTask(column,param,taskDto)
        const putField= await this.fieldService.getAllField(project)
        await this.valuesService.updateValues(putField, value, task)
        return await this.taskService.getOneTask(column, param)
    }

    ////вспомогательная функция
    private async findParent(req,param):Promise<Project>{
        const creater=await this.createrService.getCreater(req)
        return await this.projectService.getOneProject(creater, param)
         
    }
}