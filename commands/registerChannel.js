// commands/registerchannel.js
const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const scrape=require('../eventnotifier/scrape');

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

    
    fs.appendFileSync(SENT_LINKS_FILE, "");
    this.prefill(["https://forum.netmarble.com/futurefight_en/list/2196/1","https://forum.netmarble.com/futurefight_en/list/2227/1","https://forum.netmarble.com/futurefight_en/list/2517/1"])

    fs.appendFileSync(configPath, JSON.stringify(config, null, 2));

    

    await interaction.reply({
      content: `✅ Registered this channel (<#${channelId}>) for the reset reminder.`,
      ephemeral: true,
    });
  },

  async prefill(linkArr) {
    const links = new Set();
    const articleArrays = [];
  
    for (const link of linkArr) {
      const articles = await scrape.scrapeForumArticles(link);
      articleArrays.push(articles);
    }
  
    articleArrays.forEach(articleArray =>
      articleArray.forEach(article => links.add(article.link))
    );
  
    this.saveSentLinks(links);
    console.log("prefill finished");
  },
  
  saveSentLinks(sentLinks) {
    try {
        fs.writeFileSync(SENT_LINKS_FILE, JSON.stringify([...sentLinks], null, 2), 'utf8');
    } catch (error) {
        console.error('Error writing sent links file:', error);
    }
  }
};
