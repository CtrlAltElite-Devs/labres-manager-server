import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { UAParser } from 'ua-parser-js';
import { EnrichedRequest } from "../common/metadata-request";

@Injectable()
export class MetaDataInterceptor implements NestInterceptor {
    private readonly logger = new Logger(MetaDataInterceptor.name);

    intercept(context: ExecutionContext, next: CallHandler<any>)  {
        const request: EnrichedRequest = context.switchToHttp().getRequest();
        const parser = new UAParser(request.headers['user-agent']);
        const result = parser.getResult();
        this.logger.log(`parsed ua: ${JSON.stringify(result, null, 3)}`);
        const forwarded = request.headers['x-forwarded-for'] as string;
        const ip = forwarded ? forwarded.split(",")[0] : request.socket.remoteAddress;
        request.metaData = {
            browserName: result.browser.name ?? "",
            os: result.os.name ?? "",
            ipAddress: ip ?? ""
        }
        
        this.logger.log(`Metadata added: ${JSON.stringify(request.metaData)}`);
        return next.handle();
    }

}