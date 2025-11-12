import { Controller, Get, Version } from "@nestjs/common";

@Controller()
export class HealthController {
    @Get("status")
    Status(){
        return "healthy"
    }

    @Get("status")
    @Version('2')
    StatusV2(){
        return "healthy v2"
    }
}