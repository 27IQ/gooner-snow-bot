import { CommandInteraction, Client, SlashCommandOptionsOnlyBuilder} from "discord.js";
import { DB } from "./DB/DBService";

export interface Command {
    data: SlashCommandOptionsOnlyBuilder
    run: (client: Client, db:DB, interaction: CommandInteraction) => void;
}