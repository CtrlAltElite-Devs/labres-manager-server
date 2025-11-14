import { EntityManager } from '@mikro-orm/postgresql';
import { BaseJob } from '../base.job';
import { JobRecordType } from '../startup-job-registry';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { RefreshToken } from 'src/entities/security/refresh-token.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RemoveExpiredRefreshTokens extends BaseJob {
  protected isCronJob = true;

  constructor(
    private readonly em: EntityManager,
    schedulerRegistry: SchedulerRegistry,
  ) {
    super(schedulerRegistry, RemoveExpiredRefreshTokens.name);
  }

  // 🔥 Run every 5 minutes (adjust if needed)
  @Cron(CronExpression.EVERY_5_MINUTES, { name: RemoveExpiredRefreshTokens.name })
  async handle() {
    this.logger.log('Running scheduled refresh-token cleanup job...');
    await this.RunJob();
  }

  // 🔥 Also run once at app startup
  protected async runStartupTask(): Promise<JobRecordType> {
    return await this.RunJob();
  }

  // 🔥 Core logic
  private async RunJob(): Promise<JobRecordType> {
    const emInstance = this.em.fork();
    const now = new Date();

    try {
      const result = await emInstance
        .createQueryBuilder(RefreshToken)
        .delete()
        .where({
          expiresAt: { $lt: now }, // expired tokens only
        })
        .execute();

      const count = result.affectedRows ?? 0;

      return {
        status: 'executed',
        details: `Removed ${count} expired refresh tokens`,
      };
    } catch (error) {
      return {
        status: 'failed',
        details:
          `Failed to remove expired refresh tokens: ` +
          (error instanceof Error ? error.message : String(error)),
      };
    }
  }
}
