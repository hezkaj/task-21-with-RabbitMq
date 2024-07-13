import { Controller, Get, Inject } from "@nestjs/common";
import { ClientProxy, Ctx, EventPattern, MessagePattern, Payload, RmqContext } from "@nestjs/microservices";
import { CreaterService } from "./creater.service";

@Controller('/creater')
export class CreaterController{
    constructor(
        private createrService:CreaterService,
  
    ){}

    @EventPattern('delete_creater')
    async delCreater( data:number) {

        console.log('I got message to delete!')
        
        await this.createrService.delCreater(data)
        
    }

    
}
