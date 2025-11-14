import { EntityManager } from '@mikro-orm/postgresql';
import { BaseJob } from '../base.job';
import { JobRecordType } from '../startup-job-registry';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { OTP } from 'src/entities/security/otp.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RemoveExpiredOtpJob extends BaseJob {
  protected isCronJob = true;
  constructor(
    private readonly em: EntityManager,
    schedulerRegistry: SchedulerRegistry,
  ) {
    super(schedulerRegistry, RemoveExpiredOtpJob.name);
  }

  @Cron(CronExpression.EVERY_5_MINUTES, { name: RemoveExpiredOtpJob.name })
  async handle() {
    this.logger.log('Running scheduled expiry job...');
    await this.RunJob();
  }

  protected async runStartupTask(): Promise<JobRecordType> {
    return await this.RunJob();
  }

  private async RunJob(): Promise<JobRecordType> {
    const emInstance = this.em.fork();
    const now = new Date();

    try {
      const result = await emInstance
        .createQueryBuilder(OTP)
        .delete()
        .where({
          $or: [{ expiryTime: null }, { expiryTime: { $lt: now } }],
        })
        .execute();

      const count = result.affectedRows ?? 0;

      return {
        status: 'executed',
        details: `Removed ${count} expired one-time passwords`,
      };
    } catch (error) {
      return {
        status: 'failed',
        details: `Failed to remove expired OTPs: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }
}
