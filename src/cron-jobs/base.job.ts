import { Logger, OnApplicationShutdown, OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { StartupJobRegistry, JobRecordType } from './startup-job-registry';

export abstract class BaseJob implements OnModuleInit, OnApplicationShutdown {
  protected readonly logger: Logger;

  /**
   * Set this to `true` in subclasses that also use @Cron()
   * Example:
   *   protected isCronJob = true;
   */
  protected isCronJob = false;

  protected constructor(
    protected readonly schedulerRegistry: SchedulerRegistry,
    private readonly jobName: string,
  ) {
    this.logger = new Logger(jobName);
  }

  // 🔹 Called automatically on app startup
  async onModuleInit() {
    this.logger.log(`Running startup check for ${this.jobName}...`);
    try {
      const result = await this.runStartupTask();
      StartupJobRegistry.record(this.jobName, result);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(
        `Startup execution failed for ${this.jobName}: ${message}`,
      );
      StartupJobRegistry.record(this.jobName, {
        status: 'failed',
        details: message,
      });
    }
  }

  // 🔹 Each child must implement what to do at startup
  protected abstract runStartupTask(): Promise<JobRecordType>;

  // 🔹 Called on graceful shutdown
  async onApplicationShutdown(signal?: string) {
    if (!this.isCronJob) {
      // Startup-only jobs should not attempt cron cleanup
      return;
    }

    try {
      const job = this.schedulerRegistry.getCronJob(this.jobName);
      if (job) {
        await job.stop();
        this.logger.log(
          `🛑 Gracefully stopped ${this.jobName} due to app shutdown${
            signal ? ` (${signal})` : ''
          }.`,
        );
      }
    } catch {
      // Cron job not found (registry not ready or job not registered yet)
      // This is normal in Nest schedule lifecycle—ignore silently
    }
  }
}
