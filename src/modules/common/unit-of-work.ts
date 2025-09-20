import { EntityManager } from "@mikro-orm/postgresql";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from 'cache-manager';
import { Inject, Injectable, Logger } from "@nestjs/common";

export type CommitOptions = {
    invalidateKey?: string | string[];
}

@Injectable()
export class UnitOfWork {
    private readonly logger = new Logger(UnitOfWork.name);

    constructor(
        private readonly em: EntityManager,
        @Inject(CACHE_MANAGER) 
        private cacheManager: Cache
    ) {}

    async Commit(
        options: CommitOptions | undefined = undefined
    ){
        await this.em.flush();
        await this.handleOptions(options);
    }

    private async handleOptions(options: CommitOptions | undefined){
        if(options === undefined){
            return;
        }
        
        if(options.invalidateKey){
            await this.invalidateCache(options.invalidateKey)
        }
    }


    private async invalidateCache(keys: string | string[]) {
        const list = Array.isArray(keys) ? keys : [keys];
        for (const key of list) {
            this.logger.log(`Invalidating cache key: ${key}`);
            await this.cacheManager.del(key);
        }
    }
}