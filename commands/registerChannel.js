// commands/registerchannel.js
const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../data/config.json');
const SENT_LINKS_FILE = path.join(__dirname, '../data/sentLinks.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('registerchannel')
    .setDescription('Registers this channel for the reset reminder.')
    .addRoleOption(option =>
      option.setName('role')
        .setDescription('The role to ping at midnight')
        .setRequired(true)
    ),
    
    
  async execute(interaction) {
    const channelId = interaction.channel.id;
    const role = interaction.options.getRole('role');

    const config = { 
      registeredChannelId: channelId,
      pingRoleId: role.id
     };

    if(!fs.existsSync("./data"))
      fs.mkdirSync("./data")

    fs.appendFileSync(configPath, JSON.stringify(config, null, 2));
    fs.appendFileSync(SENT_LINKS_FILE, "");

    await interaction.reply({
      content: `✅ Registered this channel (<#${channelId}>) for the reset reminder.`,
      ephemeral: true,
    });
  },
};
