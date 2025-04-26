import { Client, GatewayIntentBits } from "discord.js";
import ready from "./listeners/ready";
import interactionCreate from "./listeners/interactionsCreate";
import * as dotenv from 'dotenv';
import { DB } from "./DB/DBService";

dotenv.config()
const token = process.env.TOKEN;

const db:DB=new DB;

console.log("Bot is starting...");

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

ready(client,db);
interactionCreate(client, db);

client.login(token);

client.on("close", async () => {
    db.close()
});