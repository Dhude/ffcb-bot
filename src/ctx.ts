import { TAppConfig } from "./config"
import { getGlobal } from "./globals"
import { getConfig } from "./config"
import { getLogger } from "./logger";
import { handlerTree } from './gen/handlerTree';

export type TCtx = {
  getGlobal: typeof getGlobal,
  getConfig: typeof getConfig,
  getLogger: typeof getLogger,
  handlers: typeof handlerTree,
}

export const createCtx = async (appConfig: TAppConfig): Promise<TCtx> => {
  const ctx = {
    getGlobal,
    getConfig,
    getLogger,
    handlers: handlerTree,
  }

  return ctx;
}
