import Database from 'better-sqlite3';
import fs, { Dir } from 'fs'
import path from 'path';


const DIRPATH=path.join(__dirname,"../data")
const FILENAME="db.db"
const DBPATH=path.join(DIRPATH,FILENAME)

export interface IChannel{
  guild_id: BigInt;
  channel_id: BigInt;
  role_id: BigInt;
}

export interface IsChannel{
  guild_id: string;
  channel_id:  string;
  role_id:  string;
}

export class Channel {
  guild_id: BigInt;
  channel_id: BigInt;
  role_id: BigInt;

  constructor(obj: IChannel|IsChannel){

    if (Number.isNaN(obj.guild_id)){
      this.guild_id=obj.guild_id as BigInt
      this.channel_id=obj.channel_id as BigInt
      this.role_id=obj.role_id as BigInt
    }else{
      this.guild_id=BigInt(obj.guild_id as string)
      this.channel_id=BigInt(obj.channel_id as string)
      this.role_id=BigInt(obj.role_id as string)
    }
  }

  toString():string{
    return `${this.guild_id}, ${this.channel_id}, ${this.role_id}`
  }
}

export class DB {
  private db: Database.Database;

  constructor() {
    if(!fs.existsSync(DBPATH))
      fs.mkdirSync(DIRPATH, {recursive:true});
      fs.writeFileSync(DBPATH,"")

    this.db = new Database(DBPATH);
    this.createTable();
  }

  private createTable(): void {
    this.db.prepare(`
      CREATE TABLE IF NOT EXISTS channel (
        guild_id TEXT,
        channel_id TEXT,
        role_id TEXT,
        PRIMARY KEY (guild_id, channel_id)
      )
    `).run();
  }

  public saveChannel(channel: Channel): void {
    const stmt = this.db.prepare<string[],null>(`
      INSERT OR REPLACE INTO channel (guild_id, channel_id, role_id)
      VALUES (?, ?, ?)
    `);
    stmt.run(channel.guild_id.toString(), channel.channel_id.toString(), channel.role_id.toString());
    console.log(`Saved role for guild ${channel.guild_id}, channel ${channel.channel_id}`);
  }

  public getChannel(guild_id: BigInt, channel_id: BigInt): Channel | null {
    const stmt = this.db.prepare<string[],IsChannel>(`
      SELECT * FROM channel WHERE guild_id = ? AND channel_id = ?
    `);

    const channel = stmt.get(guild_id.toString(), channel_id.toString());
    //console.log(channel.channel_id, channel.guild_id, channel.role_id)
    
    return channel ? new Channel(channel) : null;
  }

  // Close the database connection
  public close(): void {
    this.db.close();
  }
}