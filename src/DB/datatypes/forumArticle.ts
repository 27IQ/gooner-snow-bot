import { EmbedBuilder, TextChannel} from 'discord.js'

export class forumArticle{

    title:string
    link:string
    content:string

    constructor(title:string, link:string, content:string){
        this.title=title
        this.link=link
        this.content=content
    }

    sendMessage(channel:TextChannel) {
    
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

}