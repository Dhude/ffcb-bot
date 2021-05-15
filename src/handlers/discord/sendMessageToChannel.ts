import { MessageOptions, GuildChannel, TextChannel } from "discord.js";

import { TCtx } from "../../ctx";

const isTextChannel = (channel: GuildChannel): channel is TextChannel =>
  channel.type === "text";

export const sendMessageToChannel = async (
  ctx: TCtx,
  channelName: string,
  message: MessageOptions
) => {

  const discordClient = ctx.getGlobal('discord');
  const { guildId } = ctx.getConfig('discord');

  const guild = discordClient.guilds.cache.get(guildId);

  if(!guild) {
    throw new Error(`No guild found with id ${guildId}`);
  }

  const channel = guild.channels.cache.find(
    (channel) => channel.name === channelName
  );

  if (!channel) {
    throw new Error(`No channel found with name ${channelName} in ${guild.id}`);
  }

  if (!isTextChannel(channel)) {
    throw new Error(`${channelName} exists but is not a text channel`);
  }

  await channel.send(message);
};
