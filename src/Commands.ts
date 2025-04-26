import { SlashCommandBuilder } from "discord.js";
import { Command } from "./Command";
import { registerChannel } from "./commands/registerChannel";
import { timer } from "./commands/timer"

export const Commands:Command[]= [timer,registerChannel];