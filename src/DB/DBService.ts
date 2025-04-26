import Database from 'better-sqlite3';
import fs from 'fs'
import path from 'path';
import { Channel, IsChannel } from './datatypes/Channel';
import { forumArticle } from './datatypes/forumArticle';
import { scrapeForumArticles } from '../webscraper/forumScraper'



const DIRPATH=path.join(__dirname,"../data")
const FILENAME="db.db"
const DBPATH=path.join(DIRPATH,FILENAME)
const Feeds=[
  "https://forum.netmarble.com/futurefight_en/list/75/1",
  "https://forum.netmarble.com/futurefight_en/list/2517/1",
  "https://forum.netmarble.com/futurefight_en/list/2227/1",
  "https://forum.netmarble.com/futurefight_en/list/2196/1"
]

export class DB {
  private db: Database.Database;

  constructor() {
    let isFirstTime=false

    if(!fs.existsSync(DBPATH)){
      fs.mkdirSync(DIRPATH, {recursive:true});
      fs.writeFileSync(DBPATH,"")
      isFirstTime=true
    }

    this.db = new Database(DBPATH);
    this.createTable();

    if(isFirstTime)
      this.prefill()
  }

  private async prefill(){
    console.log("prefilling the articles")
    for(let feed of Feeds){
      let articles=await scrapeForumArticles(feed)

      articles.forEach(article => {
          if(!this.containsArticle(article))
            this.saveArticle(article)
      });
    }
  }

  private createTable(): void {

    //channelTable
    this.db.prepare(`
      CREATE TABLE IF NOT EXISTS channel (
        guild_id TEXT,
        channel_id TEXT,
        role_id TEXT,
        PRIMARY KEY (guild_id, channel_id)
      )
    `).run();

    //channelTable
    this.db.prepare(`
      CREATE TABLE IF NOT EXISTS articles (
        title TEXT,
        link TEXT,
        content TEXT,
        PRIMARY KEY (link)
      )
    `).run();
  }

  saveChannel(channel: Channel): void {
    const stmt = this.db.prepare<string[],null>(`
      INSERT OR REPLACE INTO channel (guild_id, channel_id, role_id)
      VALUES (?, ?, ?)
    `);
    stmt.run(channel.guild_id.toString(), channel.channel_id.toString(), channel.role_id.toString());
    console.log(`Saved role for guild ${channel.guild_id}, channel ${channel.channel_id}`);
  }

  getChannel(guild_id: BigInt, channel_id: BigInt): Channel | null {
    const stmt = this.db.prepare<string[],IsChannel>(`
      SELECT * FROM channel WHERE guild_id = ? AND channel_id = ?
    `);

    const channel = stmt.get(guild_id.toString(), channel_id.toString());
    return channel ? new Channel(channel) : null;
  }

  getAllChannels(): Channel[] | null{
    const stmt = this.db.prepare<string[],IsChannel[]>(`
      SELECT * FROM channel
    `);

    const channel = stmt.get();
    return channel ? channel.map(ischannel=>new Channel(ischannel)) : null
  }

  saveArticle(article: forumArticle): void {
    const stmt = this.db.prepare<string[],null>(`
      INSERT OR REPLACE INTO articles (title, link, content)
      VALUES (?, ?, ?)
    `);

    stmt.run(article.title, article.link, article.content);
    console.log(`Saved article ${article.title} from ${article.link}`);
  }

  containsArticle(article:forumArticle):boolean{
    const stmt = this.db.prepare<string,forumArticle>(`
      SELECT * FROM articles WHERE link = ?
    `);

    const channel = stmt.get(article.link);
    return channel!=undefined;
  }

  // Close the database connection
  public close(): void {
    this.db.close();
  }
}