import Apify from 'apify';
import { Page } from 'puppeteer';

const { sleep, puppeteer, log: logUtil } = Apify.utils;

/**
 * Attempts log user into instagram with provided username and password
 * @param {String} username Username to use during login (can also be an email or telephone)
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

    await page.type(usernameInput, username, { delay: 10 });
    await page.type(passwordInput, password, { delay: 10 });

    await page.click(submitButton);

    try {
      const errorXpath =
        '//p[contains(., "User not found") or contains(., "Incorrect username & password") or contains(., "Lock")]';
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
    log.debug(error.message);

    const storeId = Apify.getEnv().defaultKeyValueStoreId;
    const randomNumber = Math.random();
    const key = `ERROR-LOGIN-${randomNumber}`;
    const screenshot = await page.screenshot();
    await Apify.setValue(key, screenshot, { contentType: 'image/png' });

    const screenshotLink = `https://api.apify.com/v2/key-value-stores/${storeId}/records/${key}.png`;

    // You know where the code crashed so you can explain here
    console.error(`Request failed during login with an error. Screenshot: ${screenshotLink}`);

    process.exit(1);
  }
};

module.exports = {
  login,
};
