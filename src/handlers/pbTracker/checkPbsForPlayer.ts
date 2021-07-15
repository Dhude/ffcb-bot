import { MessageEmbed } from "discord.js";
import LRU from "lru-cache";
import { TCtx } from "../../ctx";
import { TSongData } from "../beatsavior/getLastPlayedSongs";
import { TPlayerData } from "../beatsavior/getPlayerData";
import { isRankedSong } from "./enrichPbData";

const asPercentage = (fraction: number) => `${(fraction * 100).toFixed(2)}%`;

const createPbMessageEmbed = (playerData: TPlayerData, songData: TSongData) => {
  const { modifiedRatio, score, personalBestModifiedRatio } =
    songData.trackers.scoreTracker;

  const isNewSong = songData.trackers.scoreTracker.personalBest === 0;
  const isFullCombo = songData.trackers.hitTracker.miss === 0;

  const message = new MessageEmbed()
    .setColor("RANDOM")
    .setAuthor(
      playerData.playerName,
      `https://new.scoresaber.com${playerData.avatar}`,
      `https://www.beatsavior.io/#/profile/${playerData.playerId}`
    )
    .setTitle(isNewSong ? 'New song!' : 'New PB!')
    .setThumbnail(
      `https://new.scoresaber.com/api/static/covers/${songData.songID}.png`
    )
    .setTimestamp(songData.timeSet)
    .addField("Song", `${songData.songArtist} - ${songData.songName}`)
    .addField("Difficulty", songData.songDifficulty)
    .addField("Score", `${score} (${asPercentage(modifiedRatio)})`)
    .setFooter(":3");

    message.setDescription([
      `(:flag_fi: ${playerData.countryRank})`,
      isFullCombo && ':fire: FULL COMBOOOO :fire:'
    ].filter(v => !!v)
    .join('\n'))

    if(!isNewSong) {
      message.addField(
        "Delta",
        `+${asPercentage(modifiedRatio - personalBestModifiedRatio)}`,
        true
      )
    }

    if(isRankedSong(songData)) {
      // Molest the difficulty field to add stars
      const difficultyField = message.fields.find(field => field.name === 'Difficulty');
      difficultyField!.value = `${difficultyField!.value} (${songData.stars} :star:)`

      message.addField('pp', `${songData.pp} (${songData.pp * songData.weight})`);
      message.addField('Global rank for song', songData.rank);
    }

  return message;
};

const isWin = (songData: TSongData) => songData.trackers.winTracker.won;

const isPersonalBest = (songData: TSongData) => {
  const newScore = songData.trackers.scoreTracker.score;
  const personalBest = songData.trackers.scoreTracker.personalBest;

  return newScore > personalBest;
};

// Store timestamp for latest processed song for each player
const pbTimestampsCache = new LRU<string, Date>({});

export const checkPbsForPlayer = async (ctx: TCtx, playerId: string) => {
  const { channelName } = ctx.getConfig("discord");
  const playerData = await ctx.handlers.beatsavior.getPlayerData(ctx, playerId);
  const latestSongs = await ctx.handlers.beatsavior.getLastPlayedSongs(
    ctx,
    playerId
  );

  const latestProcessedSongTimestamp = pbTimestampsCache.get(playerId) || ctx.getGlobal('startupTime');

  const newPbs = latestSongs
    .filter(
      (song) => song.timeSet > latestProcessedSongTimestamp
    )
    .filter(isWin)
    .filter(isPersonalBest);

  // Get the latest song timestamp, use it to filter out old entries on later runs
  pbTimestampsCache.set(
    playerId,
    new Date(latestSongs[latestSongs.length - 1].timeSet)
  );

  if(newPbs.length === 0) {
    ctx.getLogger().log(`no new pbs`, playerId)
  }

  for (const pb of newPbs) {
    const enrichedPb = await ctx.handlers.pbTracker.enrichPbData(ctx, pb);

    const message = createPbMessageEmbed(playerData, enrichedPb);
    await ctx.handlers.discord.sendMessageToChannel(ctx, channelName, message);
    ctx.getLogger().log(`new pb`, enrichedPb.playerID, enrichedPb.songID)
  }
};
