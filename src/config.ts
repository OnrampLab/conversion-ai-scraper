import { env } from './utils';

export const config = {
  user: {
    email: env('JARVIS_AI_EMAIL'),
    password: env('JARVIS_AI_PASSWORD'),
  },
  app: {
    /*
     * When using docker, you should enable the headless mode
     */
    headless: Boolean(Number(env('ENABLE_HEADLESS', '0'))),
  },
};
