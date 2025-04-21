// reminder/index.js
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../data/config.json');

function startMidnightReminder(client) {
  cron.schedule('0 0 0 * * *', async () => {
    console.log("⏰ It's midnight in Korea (KST)!");

    // Load config
    if (!fs.existsSync(configPath)) return;

    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    const channelId = config.registeredChannelId;

    if (!channelId) {
      console.warn('⚠️ No channel registered for midnight messages.');
      return;
    }

    const channel = await client.channels.fetch(channelId).catch(() => null);
    if (!channel) {
      console.warn('⚠️ Could not find registered channel.');
      return;
    }

    channel.send("🎉 Daily RESET");
  }, {
    timezone: 'Asia/Seoul',
  });

  console.log("✅ Korean midnight reminder is scheduled.");
}

module.exports = { startMidnightReminder };
