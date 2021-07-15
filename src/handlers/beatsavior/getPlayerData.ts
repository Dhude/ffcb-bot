import LRU from "lru-cache";
import { TCtx } from "../../ctx";

export type TPlayerData = {
  playerId: string;
  avatar: string;
  playerName: string;
  country: string;
  pp: number;
  rank: number;
  countryRank: number;
};

type TPlayerDataResponse = {
  playerInfo: TPlayerData
}

const playerDataCache = new LRU<string, TPlayerData>({
  maxAge: 1000 * 60,
});

const PLAYER_DATA_URL = "https://www.beatsavior.io/newscoresaber/api/player";

export const getPlayerData = async (ctx: TCtx, playerId: string): Promise<TPlayerData> => {
  const fromCache = playerDataCache.get(playerId)
  if (fromCache !== undefined) {
    return fromCache;
  }

  const result: TPlayerDataResponse = await ctx
    .getGlobal("http")(`${PLAYER_DATA_URL}/${playerId}/full`)
    .then((response) =>
      response.json().catch(async (e) => {
        throw e;
      })
    );

  ctx.getLogger().log('Fresh player data', playerId);

  playerDataCache.set(playerId, result.playerInfo)

  return result.playerInfo;
};
