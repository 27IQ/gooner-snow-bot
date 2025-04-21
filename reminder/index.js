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
    const roleId = config.pingRoleId;

    if (!channelId || !roleId) {
      console.warn('⚠️ No channel or role registered.');
      return;
    }

    const channel = await client.channels.fetch(channelId).catch(() => null);
    if (!channel) {
      console.warn('⚠️ Could not find registered channel.');
      return;
    }

    channel.send({
      content:`🎉 Daily RESET <@&${roleId}>`,
      allowedMentions: { roles: [roleId] }
    });
  }, {
    timezone: 'Asia/Seoul',
  });

  console.log("✅ MFF reset reminder is scheduled.");
}

module.exports = { startMidnightReminder };
