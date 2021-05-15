import { appConfig } from "./config";
import { createCtx } from "./ctx";
import { initDiscordClient } from "./discord";
import { periodicallyRunAllPbChecks } from "./handlers/pbTracker/periodicallyRunAllPbChecks";

const init = async () => {
  try {
    const ctx = await createCtx(appConfig);
    const logger = ctx.getLogger();
    logger.log('Initating ffcb-bot')

    await initDiscordClient(ctx);
    logger.log('Discord login success')
  
    await periodicallyRunAllPbChecks(ctx);
    logger.log('PB watchers initialized')
  } catch (e) {
    console.error(e)
    process.exit(-1)
  }
}

init();
