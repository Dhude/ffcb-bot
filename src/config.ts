import { config } from 'dotenv';

config();

export const appConfig = {
  discord: {
    authToken: process.env.DISCORD_AUTH_TOKEN,
    guildId: process.env.DISCORD_GUILD_ID,
    channelName: process.env.DISCORD_CHANNEL_NAME,
  },
  scoresaber: {
    playerIds: (process.env.SCORESABER_PLAYER_IDS || '').split(',')
  }
}

export type TAppConfig = typeof appConfig;

export const getConfig = <T extends keyof TAppConfig>(key: T): TAppConfig[T] => appConfig[key];
