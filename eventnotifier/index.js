// reminder/index.js
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
const scrape=require('./scrape');

const configPath = path.join(__dirname, '../data/config.json');
const SENT_LINKS_FILE = path.join(__dirname, '../data/sentLinks.json');

async function startForumChecker(client,link) {
  cron.schedule('0 * * * *', async () => {
    console.log("⏰ It's fetching time");

    const channel= await getChannel(client)

    if(channel==null){
      console.error("channel missing")
      return
    }

    const articles=await scrape.scrapeForumArticles(link)

    //filter the articles
    const sentLinks = loadSentLinks()
    const newArticles= articles.filter(article=>!sentLinks.has(article.link))

    newArticles.forEach(article=>{
        article.sendMessage(channel);
        sentLinks.add(article.link)
    })

    saveSentLinks(sentLinks)

  }, {
    timezone: 'Asia/Seoul',
  });

  console.log(`✅ MFF ${link} checker is scheduled.`);
}

async function getChannel(client){
    let fileContent

    if (!fs.existsSync(configPath)||(fileContent=(fs.readFileSync(configPath, 'utf-8')))=="") return null;

    const config = JSON.parse(fileContent);
    const channelId = config.registeredChannelId;
    const roleId = config.pingRoleId;

    if (!channelId || !roleId) {
      console.warn('⚠️ No channel or role registered.');
      return null;
    }

    const channel = await client.channels.fetch(channelId).catch(() => null);
    if (!channel) {
      console.warn('⚠️ Could not find registered channel.');
      return null;
    }

    return channel
}


// Function to load sent links from the JSON file
function loadSentLinks() {
    try {
        if (fs.existsSync(SENT_LINKS_FILE)) {
            const data = fs.readFileSync(SENT_LINKS_FILE, 'utf8');
            return new Set(JSON.parse(data));
        }
    } catch (error) {
        console.error('Error reading sent links file:', error);
    }
    return new Set(); // Return an empty set if there's an error or no file
}

// Function to save sent links to the JSON file
function saveSentLinks(sentLinks) {
    try {
        fs.writeFileSync(SENT_LINKS_FILE, JSON.stringify([...sentLinks], null, 2), 'utf8');
    } catch (error) {
        console.error('Error writing sent links file:', error);
    }
}

module.exports = { startForumChecker };
