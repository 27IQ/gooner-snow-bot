const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timer')
    .setDescription('Replies with the time until the next Reset.'),
  async execute(interaction) {
    
    const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
  
    // Create a new Date for the next midnight in Korea
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0); // 24:00 = 00:00 of the next day
  
    // Calculate the difference in milliseconds
    const diffMs = midnight - now;
  
    // Convert to hours, minutes, seconds
    const totalSeconds = Math.floor(diffMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const time=

    await interaction.reply(`Zeit bis zum nächsten reset: ${hours.toLocaleString().length<2?"0"+hours.toLocaleString():hours.toLocaleString()}:${minutes.toLocaleString().length<2?"0"+minutes.toLocaleString():minutes.toLocaleString()}:${seconds.toLocaleString().length<2?"0"+seconds.toLocaleString():seconds.toLocaleString()}`);
  },
};
