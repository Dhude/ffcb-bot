import { TCtx } from "../../ctx";

export type TSongData = {
  _id: string;
  playerID: string;
  songID: string;
  songDifficulty: string;
  songName: string;
  songArtist: string;
  songMapper: string;
  timeSet: Date;
  trackers: {
    winTracker: {
      won: boolean;
      rank: string;
    };
    scoreTracker: {
      score: number;
      modifiedRatio: number;
      personalBest: number;
      personalBestModifiedRatio: number;
    };
    hitTracker: {
      maxCombo: number;
      miss: number;
    }
  };
};

const LATEST_PLAYED_SONGS_URL =
  "https://www.beatsavior.io/api/livescores/player";

export const getLastPlayedSongs = async (
  ctx: TCtx,
  playerId: string
): Promise<TSongData[]> => {
  const result: TSongData[] = await ctx
    .getGlobal("http")(`${LATEST_PLAYED_SONGS_URL}/${playerId}`)
    .then((response) =>
      response.json().catch(async (e) => {
        throw e;
      })
    );

  return result.map((song) => ({
    ...song,
    timeSet: new Date(song.timeSet),
  }));
};
