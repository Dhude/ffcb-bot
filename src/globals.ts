import { Client } from "discord.js";
import fetch from "node-fetch";

const globals = {
  discord: new Client(),
  http: fetch,
  startupTime: new Date(),
};

export type TGlobals = typeof globals;
export const getGlobal = <T extends keyof typeof globals>(
  key: T
): typeof globals[T] => {
  return globals[key];
};
