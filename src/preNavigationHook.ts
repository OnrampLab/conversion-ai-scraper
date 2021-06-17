import Apify from 'apify';
import { login } from './login';
import { Input } from './types';

const {
  utils: { log: logUtil },
} = Apify;

export const preNavigationHook = async ({ request, page, session }) => {
  const log = logUtil.child({ prefix: 'PreNavigationHook' });

  const { loginUsername, loginPassword } = (await Apify.getInput()) as Input;

  if (loginUsername && loginPassword) {
    await login(loginUsername, loginPassword, page, request);

    const cookies = await page.cookies();

    await Apify.setValue('OUTPUT', cookies);

    log.info(
      '\n-----------\n\nCookies saved, check OUTPUT in the key value store\n\n-----------\n',
    );
    return null;
  }
};
