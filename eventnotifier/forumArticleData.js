const { EmbedBuilder } = require('discord.js');

class forumArticleData{

    constructor(title, link, content){
        this.title=title
        this.link=link
        this.content=content
    }

    async sendMessage(channel) {
    
        const embed = new EmbedBuilder()
            .setTitle(this.title)
            .setURL(this.link)
            .setDescription(this.content.length > 4000 ? this.content.slice(0, 4000) + '...' : this.content)
            .setColor(0x0099ff)
            .setTimestamp()
            .setFooter({ text: 'powered by Gooner Snow™' });
    
        console.log(`[SENDING] ${this.title}`);
        return channel.send({ embeds: [embed] });
    }

}module.exports = forumArticleData