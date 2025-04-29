import { Client } from "discord.js"
import cron from 'node-cron'
import { DB } from "../DB/DBService";
import { scrapeForumArticles } from "../webscraper/forumScraper"
import { IForumCronJob } from "../CronJob";
import { Channel } from "../DB/datatypes/Channel";

export const ArticleCronJob:IForumCronJob={
    name: "ArticleCronJob",
    links: [
        "https://forum.netmarble.com/futurefight_en/list/75/1",
        "https://forum.netmarble.com/futurefight_en/list/2517/1",
        "https://forum.netmarble.com/futurefight_en/list/2227/1",
        "https://forum.netmarble.com/futurefight_en/list/2196/1"
      ],
    start: function (client:Client, db:DB): void {
        cron.schedule('0 * * * *', async () => {
            console.log(`fetching for ${this.name}`);
    
            const channels=db.getAllChannels()
    
            if(channels==null){
                console.error(`no Channels found for ${this.name}`)
                return
            }
    
            let articlesArrays = await Promise.all(
                this.links.map(link => scrapeForumArticles(link))
            );
            
            const newArticles = await Promise.all(
                articlesArrays.flat().filter(article=>!db.containsArticle(article)
            ))
            
            channels.forEach((channel:Channel)=>{
                newArticles.forEach(async article=>{
                    article.sendMessage(await channel.resolve(client))
                    db.saveArticle(article)
                })
            })
        }, {
            timezone: 'Asia/Seoul',
        });
    }
}