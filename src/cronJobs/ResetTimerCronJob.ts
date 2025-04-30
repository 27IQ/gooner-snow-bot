import { Client } from "discord.js";
import { DB } from "../DB/DBService";
import { IsimpleCronJob } from "../CronJob";
import cron from "node-cron"

export const ResetTimerCronJob:IsimpleCronJob ={
    name: "ResetTimerCronJob",
    start: function (client: Client, db: DB): void {
        cron.schedule('0 0 0 * * *', async () => {
            resetTimerMessage(client,db,this.name)
        }, {
              timezone: 'Asia/Seoul',
        });
    }
}

export function resetTimerMessage(client: Client, db: DB, name:string){
    const channels=db.getAllChannels()

    if(channels==null){
        console.error(`no Channels found for ${name}`)
        return
    }

    channels.forEach(channel=>channel.send(client,`TIMER RESET <@&${channel.role_id}>`))

    console.log(`${name}: reset message send`)
}