export interface Env {
  DATABASE_URL: string;
  LINE_CHANNEL_ACCESS_TOKEN: string;
  LINE_CHANNEL_SECRET: string;
  WEB_APP_URL: string;
}

export interface Variables {
  rawBody: string;
}

export function envFromProcess(): Env {
  const { DATABASE_URL, LINE_CHANNEL_ACCESS_TOKEN, LINE_CHANNEL_SECRET, WEB_APP_URL } = process.env;
  if (!DATABASE_URL) throw new Error("DATABASE_URL is required");
  if (!LINE_CHANNEL_ACCESS_TOKEN) throw new Error("LINE_CHANNEL_ACCESS_TOKEN is required");
  if (!LINE_CHANNEL_SECRET) throw new Error("LINE_CHANNEL_SECRET is required");
  if (!WEB_APP_URL) throw new Error("WEB_APP_URL is required");
  return { DATABASE_URL, LINE_CHANNEL_ACCESS_TOKEN, LINE_CHANNEL_SECRET, WEB_APP_URL };
}
