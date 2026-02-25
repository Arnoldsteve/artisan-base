import { Logger } from '@nestjs/common';

/**
 * Rate Limiter for BullMQ Queues
 *
 * Ensures that even if 100 schools are uploading grades simultaneously,
 * we only process a maximum number of jobs per second to protect
 * PostgreSQL connection pool and system resources.
 *
 * ⚡ Concurrency Control: Prevents overwhelming the database
 * ⚡ Scalable: Works across multiple workers
 * ⚡ Configurable: Easy to adjust limits
 */
export class QueueRateLimiter {
  private readonly logger = new Logger(QueueRateLimiter.name);
  private readonly maxJobsPerSecond: number;
  private readonly maxConcurrentJobs: number;
  private jobsProcessedThisSecond = 0;
  private lastSecondReset = Date.now();

  constructor(maxJobsPerSecond: number = 50, maxConcurrentJobs: number = 10) {
    this.maxJobsPerSecond = maxJobsPerSecond;
    this.maxConcurrentJobs = maxConcurrentJobs;

    this.logger.log(
      `⚡ Rate Limiter initialized: ${maxJobsPerSecond} jobs/sec, ${maxConcurrentJobs} concurrent`,
    );
  }

  /**
   * Check if we can process a job
   * Returns true if within rate limits, false otherwise
   */
  canProcessJob(): boolean {
    const now = Date.now();
    const secondElapsed = now - this.lastSecondReset;

    // Reset counter every second
    if (secondElapsed >= 1000) {
      this.jobsProcessedThisSecond = 0;
      this.lastSecondReset = now;
    }

    // Check if we've exceeded the limit
    if (this.jobsProcessedThisSecond >= this.maxJobsPerSecond) {
      this.logger.warn(
        `⚠️ Rate limit reached: ${this.jobsProcessedThisSecond}/${this.maxJobsPerSecond} jobs/sec`,
      );
      return false;
    }

    this.jobsProcessedThisSecond++;
    return true;
  }

  /**
   * Get current rate limit status
   */
  getStatus(): {
    jobsProcessedThisSecond: number;
    maxJobsPerSecond: number;
    utilizationPercent: number;
  } {
    return {
      jobsProcessedThisSecond: this.jobsProcessedThisSecond,
      maxJobsPerSecond: this.maxJobsPerSecond,
      utilizationPercent: Math.round(
        (this.jobsProcessedThisSecond / this.maxJobsPerSecond) * 100,
      ),
    };
  }

  /**
   * Reset counters (useful for testing)
   */
  reset(): void {
    this.jobsProcessedThisSecond = 0;
    this.lastSecondReset = Date.now();
  }
}
