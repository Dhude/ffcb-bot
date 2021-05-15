import { getLastPlayedSongs } from "../handlers/beatsavior/getLastPlayedSongs";
import { getPlayerData } from "../handlers/beatsavior/getPlayerData";
import { sendMessageToChannel } from "../handlers/discord/sendMessageToChannel";
import { checkPbsForPlayer } from "../handlers/pbTracker/checkPbsForPlayer";

export const handlerTree = {
    beatsavior: {
      getLastPlayedSongs,getPlayerData
    },
    discord: {
      sendMessageToChannel
    },
    pbTracker: {
      checkPbsForPlayer
    }
}
  