import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";


@ApiTags('действия с полями задач')
@Controller('value/:user_id/:project_id/fields')
export class ValuesController{
    constructor(

        
    ){}
}