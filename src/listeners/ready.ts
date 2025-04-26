import { Client, Routes } from "discord.js";
import { Commands } from "../Commands";
import { REST } from '@discordjs/rest';


export default (client: Client): void => {
    client.on("ready", async () => {
        if (!client.user || !client.application)
            return

        
        console.log(`setting commands: ${Commands.map(command=>command.data.name)}`)
        
        const guild = client.guilds.cache.get(process.env.GUILDID!)

        await guild!.commands.set(Commands.map(command=>command.data.toJSON()))

        console.log(`${client.user.username} is online`);
    });
};