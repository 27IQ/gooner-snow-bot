import { Client, Routes } from "discord.js";
import { Commands } from "../Commands";
import { REST } from '@discordjs/rest';
import dotenv from 'dotenv';

export default (client: Client): void => {
    client.on("ready", async () => {
        if (!client.user || !client.application)
            return

        console.log(`setting commands: ${Commands.map(command=>command.name)}`)
        await client.application.commands.set(Commands);

        console.log(`${client.user.username} is online`);
    });
};