import Apify from 'apify';
import { Page } from 'puppeteer';
import { InfoError } from './errors';

const { sleep, puppeteer, log: logUtil } = Apify.utils;

/**
 * Attempts log user into instagram with provided username and password
 * @param {String} username Username to use during login (should be an email)
 * @param {String} password Password to  use during login
 * @param {Puppeteer.Page} page Puppeteer Page object
 * @return Does not return anything
 */
export const login = async (username: string, password: string, page: Page, request: Request) => {
  const log = logUtil.child({ prefix: 'Login' });

  log.info('Attempting to log in');

  const url = 'https://app.conversion.ai/';

  try {
    // go to login page
    await page.goto(url);

    const usernameInput = 'input[id="email"]';
    const passwordInput = 'input[id="password"]';
    const submitButton = 'form button[type="submit"]';

    await Promise.all([
      page.waitForSelector(usernameInput, { visible: true, timeout: 15000 }),
      page.waitForSelector(passwordInput, { visible: true, timeout: 15000 }),
      page.waitForSelector(submitButton, { visible: true, timeout: 15000 }),
    ]);

    log.info('Typing email & password');
    await page.type(usernameInput, username, { delay: 10 });
    await page.type(passwordInput, password, { delay: 10 });

    log.info('Submit form');
    await page.click(submitButton);

    try {
      const errorXpath =
        '//p[contains(., "User not found") or contains(., "Incorrect username & password") or contains(., "temporarily disabled")]';
      await page.waitForXPath(errorXpath, { timeout: 5000 });

      const [errorElement] = await page.$x(errorXpath);
      const message = await errorElement.evaluate(node => node.textContent);

      throw new Error(`Invalid credentials: ${message}`);
    } catch (e: any) {
      if (e.message.includes('Invalid')) {
        throw e;
      }
    }

    log.info('Successfully logged in');
    await sleep(3000);
  } catch (error: any) {
    log.exception(error);

    throw new InfoError('Failed to login', {
      namespace: 'login',
      url: page.url(),
    });
  }
};

module.exports = {
  login,
};
