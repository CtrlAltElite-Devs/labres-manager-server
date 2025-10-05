import { DefaultLogger, LogContext, LoggerNamespace } from "@mikro-orm/core";
import { MikroOrmQueryEmitterService } from '../../modules/common/lens/mikro-orm-query-emitter.service';

const mikroOrmEmiiterService = new MikroOrmQueryEmitterService();

export class MikroORMLogger extends DefaultLogger{
    log(namespace: LoggerNamespace, message: string, context?: LogContext): void {
        super.log(namespace, message, context)

        mikroOrmEmiiterService.emitCustomQuery(
            (context?.query) as string, 
            (context?.params) as any[], 
            (context?.took) as number
        );
        
    }
}