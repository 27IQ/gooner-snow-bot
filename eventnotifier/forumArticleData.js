class forumArticleData{

    constructor(title, link, content){
        this.title=title
        this.link=link
        this.content=content
    }

    sendMessage(channel) {
        const embed = new EmbedBuilder()
            .setTitle(this.title)
            .setURL(this.link)
            .setDescription(this.content.length > 4000 ? this.content.slice(0, 4000) + '...' : this.content)
            .setColor(0x0099ff)
            .setTimestamp()
            .setFooter({ text: 'powered by Gooner Snow™' });

        return channel.send({ embeds: [embed] });
    }

}module.exports = forumArticleData