import { env } from './utils';

export const config = {
  user: {
    email: env('CONVERSION_AI_EMAIL'),
    password: env('CONVERSION_AI_PASSWORD'),
  },
  app: {
    /*
     * When using docker, you should enable the headless mode
     */
    headless: Boolean(env('ENABLE_HEADLESS', 'false')),
  },
};
