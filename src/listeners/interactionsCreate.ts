import { CommandInteraction, Client, Interaction } from "discord.js";
import { Commands } from "../Commands";
import { DB } from "src/DB/DBService";

export default (client: Client, db:DB): void => {
    client.on("interactionCreate", async (interaction: Interaction) => {
        if (interaction.isChatInputCommand()) {
            await handleSlashCommand(client, db, interaction);
        }
    });
};

const handleSlashCommand = async (client: Client, db:DB, interaction: CommandInteraction): Promise<void> => {
    const slashCommand = Commands.find(c => c.data.name === interaction.commandName);
    if (!slashCommand) {
        interaction.followUp({ content: "An error has occurred" });
        return;
    }

    await interaction.deferReply();
    console.log(`executing ${slashCommand}`)
    slashCommand.run(client,db , interaction);
};