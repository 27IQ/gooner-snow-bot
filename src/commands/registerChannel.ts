import {Client, CommandInteraction, SlashCommandBuilder } from "discord.js";
import { Command } from "src/Command";
import { DB } from "../DB/DBService";
import { Channel, IChannel } from "../DB/datatypes/Channel";

export const registerChannel:Command= {
    data: new SlashCommandBuilder()
    .setName('registerchannel')
    .setDescription('Registers this channel for the reset reminder.')
    .addRoleOption(option =>
      option.setName('role')
        .setDescription('The role to ping at midnight')
        .setRequired(true)
    ),
    async run(client:Client,interaction:CommandInteraction<any>) {

        const guild_id:BigInt=BigInt(process.env.GUILDID!)
        let role=interaction.options.get('role')
        if(role==null)
            return;

        const role_id =BigInt(role.role!.id)
        const channel_id=BigInt(interaction.channel!.id)

        const channel=new Channel({guild_id, channel_id, role_id} as IChannel)

        const db=new DB();
        db.saveChannel(channel);
        let retreivedData:Channel=db.getChannel(guild_id,channel_id)!
        console.log(retreivedData.toString())
        console.log(`added channel to DB`)
        //db.close()

        prefill()

        interaction.followUp(`The Channel got registered with the <@&${retreivedData.role_id}> role.`)
    }
}