import { Client, TextChannel } from "discord.js";

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

  async resolve(client:Client):Promise<TextChannel>{
    const guild= await client.guilds.fetch(this.guild_id.toString())
    return await guild.channels.fetch(this.channel_id.toString())as TextChannel
  }

  async send(client:Client,message:string){
    const channel=await this.resolve(client)
    channel.send(message)
  }
}

