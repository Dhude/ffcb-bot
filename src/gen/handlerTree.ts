import { getLastPlayedSongs } from "../handlers/beatsavior/getLastPlayedSongs";
import { getPlayerData } from "../handlers/beatsavior/getPlayerData";
import { sendMessageToChannel } from "../handlers/discord/sendMessageToChannel";
import { checkPbsForPlayer } from "../handlers/pbTracker/checkPbsForPlayer";
import { enrichPbData } from "../handlers/pbTracker/enrichPbData";
import { periodicallyRunAllPbChecks } from "../handlers/pbTracker/periodicallyRunAllPbChecks";
import { getRecentScoresForPlayer } from "../handlers/scoresaber/getRecentScoresForPlayer";
import { getStarsForSong } from "../handlers/scoresaber/getStarsForSong";

export const handlerTree = {
    beatsavior: {
      getLastPlayedSongs,
			getPlayerData
    },
    discord: {
      sendMessageToChannel
    },
    pbTracker: {
      checkPbsForPlayer,
			enrichPbData,
			periodicallyRunAllPbChecks
    },
    scoresaber: {
      getRecentScoresForPlayer,
			getStarsForSong
    }
}
  