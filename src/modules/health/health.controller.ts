import { Controller, Get } from "@nestjs/common";

@Controller()
export class HealthController {
    @Get("status")
    Status(){
        return "healthy"
    }
}