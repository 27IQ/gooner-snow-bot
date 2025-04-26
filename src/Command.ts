import { CommandInteraction, ChatInputApplicationCommandData, Client, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder} from "discord.js";

export interface Command {
    data: SlashCommandOptionsOnlyBuilder
    run: (client: Client, interaction: CommandInteraction) => void;
}