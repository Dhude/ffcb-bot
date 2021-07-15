import memoize from 'memoizee';
import { TCtx } from '../../ctx';

import { TSongData } from "../beatsavior/getLastPlayedSongs";

type TRankedSongData = TSongData & {
  isRanked: true;
  stars: number;
  pp: number;
  weight: number;
  rank: number;
}

export type TEnrichedSongData = TSongData | TRankedSongData;

export const isRankedSong = (songData: TSongData): songData is TRankedSongData => (songData as any).isRanked === true;

const getRecentScoresForPlayer = (ctx: TCtx, playerId:string) => ctx.handlers.scoresaber.getRecentScoresForPlayer(ctx, playerId);

const getRecentScoresForPlayerMemoized = memoize(getRecentScoresForPlayer, { 
  async: true,
  maxAge: 1000 * 60
})

export const enrichPbData = async (ctx: TCtx, songData: TSongData): Promise<TEnrichedSongData> => {
  
  const recentScoreSaberScores = await getRecentScoresForPlayerMemoized(ctx, songData.playerID);

  // Beatsavior does not include the performanceId, so we need to use songHash and timeSet proximity
  const matchingSong = recentScoreSaberScores.find(recent => 
    recent.songHash === songData.songID && 
    // Beatsavior / scoresaber submissions must be within 30 seconds of one another
    Math.abs(recent.timeSet.getTime() - songData.timeSet.getTime()) < 30000 
  );

  // No enrichment data found so just return as is
  if(!matchingSong) {
    return songData;
  }

  const isRanked = matchingSong.pp > 0;

  // Enrichment is only for ranked song, return as is
  if(!isRanked) {
    return songData;
  }

  const stars = await ctx.handlers.scoresaber.getStarsForSong(ctx, matchingSong.leaderboardId);
  
  return {
    ...songData,
    ...matchingSong,
    stars,
    isRanked: true,
  }
}
