import { TCtx } from "../../ctx";


const FIFTEEN_MINUTES = 1000 * 60 * 15;
const sleep = (time: number) => new Promise(resolve => setTimeout(resolve, time))

export const periodicallyRunAllPbChecks = (ctx: TCtx) => {
  const { playerIds } = ctx.getConfig('scoresaber');
  setInterval(async () => {
    for(const playerId of playerIds) {
      try {
        await ctx.handlers.pbTracker.checkPbsForPlayer(ctx, playerId)
        await sleep(5000)
      } catch(e) {
        ctx.getLogger().error(e)
      }
    }
  }, FIFTEEN_MINUTES)
}
