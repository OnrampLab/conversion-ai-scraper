import Apify from 'apify';

const {
  utils: { log },
} = Apify;

export const clickAndScreenshot = async (
  page,
  targetText: string,
  buttonXpath: string,
  expectedXpath: string,
) => {
  log.debug(`Click ${targetText}`);
  const [button] = await page.$x(buttonXpath);
  log.debug(`Waiting`);

  await button.click();
  await page.waitForXPath(expectedXpath, {
    visible: true,
    timeout: 15000,
  });
  log.debug(`Done`);

  // await page.screenshot({ path: `screenshots/${targetText}.png` });
};
