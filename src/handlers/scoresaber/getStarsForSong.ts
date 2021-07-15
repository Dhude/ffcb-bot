import { TCtx } from "../../ctx";

const getScoreSaberUrl = (leaderboardId: number) =>
  `https://www.scoresaber.com/leaderboard/${leaderboardId}`;

/**
 * 
 * Crawl & Parse stars from leaderboard page in scoresaber
 * 
 * @param ctx CTX
 * @param leaderboardId leaderboardId found in song data
 * @returns 
 */
export const getStarsForSong = async (
  ctx: TCtx,
  leaderboardId: number
): Promise<number> => {
  const result = await ctx
    .getGlobal("http")(getScoreSaberUrl(leaderboardId))
    .then((response) =>
      response.text()
    );

  const starsRegexp = /Stars: (\d\.\d\d)★/ 

  const match = result.match(starsRegexp);

  if (match === null) {
    return -1;
  }

  const stars = parseFloat(match[1])

  return stars;
};
