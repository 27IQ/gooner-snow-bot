import { ICronJob } from "./CronJob";
import { ArticleCronJob } from "./cronJobs/ArticleCronJob";
import { ResetTimerCronJob } from "./cronJobs/ResetTimerCronJob";

export const cronJobs:ICronJob[]=[ArticleCronJob,ResetTimerCronJob]