import Apify from 'apify';
import { config } from './config';
import { InfoError } from './errors';
import { login } from './login';

const {
  utils: { log: logUtil },
} = Apify;

export const preNavigationHook = async ({ request, page, session }) => {
  const log = logUtil.child({ prefix: 'PreNavigationHook' });

  try {
    const { email, password } = config.user;

    if (email && password) {
      await login(email, password, page, request);

      const cookies = await page.cookies();

      await Apify.setValue('OUTPUT', cookies);

      log.info(
        '\n-----------\n\nCookies saved, check OUTPUT in the key value store\n\n-----------\n',
      );
      return null;
    }
  } catch (e) {
    if (e instanceof InfoError) {
      throw e;
    }

    const error = e as Error;

    log.exception(error);

    throw new InfoError('Failed to do PreNavigationHook', {
      namespace: 'preNavigationHook',
      url: page.url(),
    });
  }
};
