import { CommandInteraction, Client, SlashCommandBuilder } from "discord.js";
import { Command } from "../Command";
import { DB } from "src/DB/DBService";

export const timer: Command = {
    data: new SlashCommandBuilder()
        .setName('timer')
        .setDescription('Replies with the time until the next Reset.'),
    async run (client: Client, db:DB, interaction: CommandInteraction<any>){

        const now: Date = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
        
        const midnight: Date = new Date(now);
        midnight.setHours(24, 0, 0, 0);

        // Calculate the difference in milliseconds
        const diffMs = midnight.getTime() - now.getTime();

        // Convert to hours, minutes, seconds
        const totalSeconds = Math.floor(diffMs / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        await interaction.followUp(`Time until the next reset: ${hours.toLocaleString().length<2?"0"+hours.toLocaleString():hours.toLocaleString()}:${minutes.toLocaleString().length<2?"0"+minutes.toLocaleString():minutes.toLocaleString()}:${seconds.toLocaleString().length<2?"0"+seconds.toLocaleString():seconds.toLocaleString()}`);
    }
};