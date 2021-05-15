import { config } from "dotenv";

config();

const createAppConfig = () => {
  const discord = {
    authToken: process.env.DISCORD_AUTH_TOKEN || '',
    guildId: process.env.DISCORD_GUILD_ID || '',
    channelName: process.env.DISCORD_CHANNEL_NAME || '',
  };

  Object.entries(discord).forEach(([key, value]) => {
    if(value === '') {
      throw new Error(`missing appConfig: discord.${key}`)
    }
  });

  return {
    discord,
    scoresaber: {
      playerIds: (process.env.SCORESABER_PLAYER_IDS || "").split(","),
    },
  };
};

export const appConfig = createAppConfig();

export type TAppConfig = typeof appConfig;

export const getConfig = <T extends keyof TAppConfig>(key: T): TAppConfig[T] =>
  appConfig[key];
