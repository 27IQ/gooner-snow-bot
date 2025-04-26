import { Client } from "discord.js";
import { Commands } from "../Commands";
import { DB } from "../DB/DBService";
import { cronJobs } from "../CronJobs";


export default (client: Client, db:DB): void => {
    client.on("ready", async () => {
        if (!client.user || !client.application)
            return

        //register commands
        console.log(`setting commands: ${Commands.map(command=>command.data.name)}`)
        const guild = client.guilds.cache.get(process.env.GUILDID!)
        await guild!.commands.set(Commands.map(command=>command.data.toJSON()))

        console.log(`${client.user.username} is online`);

        //start cronjobs
        cronJobs.forEach(job=>{
            job.start(client,db)
            console.log(`cronjob ${job.name} has started`)
        })
    });
};