import { TCtx } from "../../ctx";

export type TRecentSongData = {
  scoreId: string;
  songHash: string;
  leaderboardId: number;
  pp: number;
  weight: number;
  timeSet: Date;
};

type TRecentSongsResponse = {
  scores: TRecentSongData[];
}

const getScoreSaberUrl = (playerId: string) =>
  `https://www.beatsavior.io/newscoresaber/api/player/${playerId}/scores/recent/1`;

export const getRecentScoresForPlayer = async (
  ctx: TCtx,
  playerId: string
): Promise<TRecentSongData[]> => {
  const result: TRecentSongsResponse = await ctx
    .getGlobal("http")(getScoreSaberUrl(playerId))
    .then((response) =>
      response.json().catch(async (e) => {
        throw e;
      })
    );

  return result.scores.map((song) => ({
    ...song,
    timeSet: new Date(song.timeSet),
  }));
};
