// commands/registerchannel.js
const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../data/config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('registerchannel')
    .setDescription('Registers this channel for the reset reminder.'),
  async execute(interaction) {
    const channelId = interaction.channel.id;

    const config = { registeredChannelId: channelId };
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

    await interaction.reply({
      content: `✅ Registered this channel (<#${channelId}>) for the reset reminder.`,
      ephemeral: true,
    });
  },
};
