import Apify from 'apify';
import { handleStart, handleList, handleDetail } from './routes';


const {
  utils: { puppeteer, log: logUtil },
} = Apify;

Apify.main(async () => {
  const input: Input | null = (await Apify.getInput()) as any;

  if (!input || typeof input !== 'object') {
    throw new Error('Missing input');
  }

  const { loginUsername, loginPassword, taskType, task, proxy, debugLog = false } = input;

  if (debugLog) {
    logUtil.setLevel(logUtil.LEVELS.DEBUG);
  }

  const log = logUtil.child({ prefix: 'Main' });

  log.info('Starting Main Process');

  const startUrls = [
    {
      url: 'https://app.conversion.ai/',
    },
  ];

  const requestList = await Apify.openRequestList('start-urls', startUrls);
  const requestQueue = await Apify.openRequestQueue();
  const proxyConfiguration = await Apify.createProxyConfiguration(proxy);

  const crawler = new Apify.PuppeteerCrawler({
    requestList,
    requestQueue,
    proxyConfiguration,
    launchContext: {
      // Chrome with stealth should work for most websites.
      // If it doesn't, feel free to remove this.
      useChrome: true,
      stealth: true,
    },
    handlePageFunction: async (context) => {
      const {
        url,
        userData: { label },
      } = context.request;
      log.info('Page opened.', { label, url });
      switch (label) {
        case 'LIST':
          return handleList(context);
        case 'DETAIL':
          return handleDetail(context);
        default:
          return handleStart(context);
      }
    },
  });

  log.info('Starting the crawl.');
  await crawler.run();
  log.info('Crawl finished.');
});
