import { Client } from "discord.js";
import { DB } from "../DB/DBService";
import { IsimpleCronJob } from "../CronJob";
import cron from "node-cron"

export const ResetTimerCronJob:IsimpleCronJob ={
    name: "ResetTimerCronJob",
    start: function (client: Client, db: DB): void {
        cron.schedule('0 0 0 * * *', async () => {

            const channels=db.getAllChannels()

            if(channels==null)
                return

            channels.forEach(channel=>channel.send(client,`TIMER RESET <@&${channel.role_id}>`))
        }, {
              timezone: 'Asia/Seoul',
        });
    }
}