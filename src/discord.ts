import { Client, MessageOptions, GuildChannel, TextChannel } from "discord.js";
import { appConfig } from "./config";
import { TCtx } from "./ctx";

export const initDiscordClient = (ctx: TCtx) =>
  new Promise((resolve, reject) => {
    const { authToken } = ctx.getConfig("discord");
    const client = ctx.getGlobal("discord");

    client.on("ready", () => resolve(client));

    client.login(authToken).catch((e) => reject(e));
  });
