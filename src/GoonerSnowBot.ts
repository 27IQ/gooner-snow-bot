import { Client, GatewayIntentBits } from "discord.js";
import ready from "./listeners/ready";
import interactionCreate from "./listeners/interactionsCreate";
import * as dotenv from 'dotenv';

dotenv.config()
const token = process.env.TOKEN;

console.log("Bot is starting...");

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

ready(client);
interactionCreate(client);

client.login(token);