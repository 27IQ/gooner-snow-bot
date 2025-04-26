import { Client } from "discord.js"
import { DB } from "./DB/DBService"

export interface ICronJob {
    name: string
    start: (client:Client, db:DB,... args: any[]) => void
}

export interface IsimpleCronJob extends ICronJob{
    start: (client:Client, db:DB) => void
}

export interface IForumCronJob extends ICronJob{
    name: string
    links:string[]
}