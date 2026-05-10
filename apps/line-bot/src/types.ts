export interface Env {
  DATABASE_URL: string;
  LINE_CHANNEL_ACCESS_TOKEN: string;
  LINE_CHANNEL_SECRET: string;
  WEB_APP_URL: string;
}

export interface Variables {
  rawBody: string;
}
