// index.js
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const { startMidnightReminder } = require('./reminder');
const { startForumChecker } = require('./eventnotifier');

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.commands = new Collection();

// Load slash commands
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

client.once('ready', () => {
  console.log(`🟢 Logged in as ${client.user.tag}`);
  startMidnightReminder(client);
  startForumChecker(client,"https://forum.netmarble.com/futurefight_en/list/2196/1")//Update news
  startForumChecker(client,"https://forum.netmarble.com/futurefight_en/list/2227/1")//Sneakpeek
  startForumChecker(client,"https://forum.netmarble.com/futurefight_en/list/2517/1")//Events (Ongoing)
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error executing that command.', ephemeral: true });
  }
});

client.login(process.env.TOKEN);
