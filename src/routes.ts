import Apify from 'apify';
import { InfoError } from './errors';
import { HandlerFactory } from './task';
import { ApifyContext, Tasks } from './types';
import { click } from './utils';

const {
  utils: { log: logUtil },
} = Apify;

export const handle = async (context: ApifyContext, task: Tasks) => {
  const log = logUtil.child({ prefix: 'Routes' });

  const { request, page } = context;

  try {
    log.debug('Waiting for home page');
    await page.waitForFunction(
      () => {
        return document.querySelector('#app');
      },
      { timeout: 15000 },
    );

    await Promise.all([
      page.waitForSelector('#app', { visible: true, timeout: 30000 }),
      page.waitForSelector('button div', { visible: true, timeout: 30000 }),
    ]);

    const targetText = 'Templates';
    await click(
      page,
      targetText,
      `//button[div[contains(., "${targetText}")]]`,
      `//h2[contains(., "${targetText}")]`,
    );

    const handler = HandlerFactory.createHandler(task);
    log.debug('Created handler', { handle });

    await handler.handle(page, task);
  } catch (error) {
    if (error instanceof InfoError) {
      throw error;
    }

    log.error('Failed to handle route', { error });

    throw new InfoError<typeof error>(`Failed to do task`, {
      url: page.url(),
      namespace: 'route',
      task: task,
    });
  }
};
