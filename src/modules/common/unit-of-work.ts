import { EntityManager } from "@mikro-orm/postgresql";
import { Injectable, Logger } from "@nestjs/common";
import { CacheService } from "./cache-service";

export type CommitOptions = {
  invalidateCacheKey?: string | string[];
}

@Injectable()
export class UnitOfWork {
  private readonly logger = new Logger(UnitOfWork.name);

  constructor(
    private readonly em: EntityManager,
    private cacheService: CacheService
  ) { }

  async Commit(
    options: CommitOptions | undefined = undefined
  ): Promise<void> {
    try {
      await this.em.begin();
      await this.em.commit();
      this.logger.log(`Transaction Committed`);
      await this.handleOptions(options);
    } catch (error) {
      await this.em.rollback();
      this.logger.error(`Failed to commit changes, ${error}`);
      throw error;
    }
  }

  private async handleOptions(options: CommitOptions | undefined) {
    if (options === undefined) {
      return;
    }

    if (options.invalidateCacheKey) {
      await this.invalidateCache(options.invalidateCacheKey)
    }
  }


  private async invalidateCache(keys: string | string[]) {
    const list = Array.isArray(keys) ? keys : [keys];
    for (const key of list) {
      this.logger.log(`Invalidating cache key: ${key}`);
      await this.cacheService.del(key);
    }
  }
}
