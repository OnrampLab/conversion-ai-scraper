import Apify from 'apify';
import { Log } from 'apify-shared/log';
import { Page } from 'puppeteer';
import { SkillTasks } from '../../types';
import { AbstractAdsSkillHandler } from '../core/handlers/AbstractAdsSkillHandler';

const {
  utils: { log },
} = Apify;

export abstract class AbstractGoogleAdsSkillHandler extends AbstractAdsSkillHandler {
  protected name: string;
  protected dataKey: string;
  protected log: Log;

  protected async fillFormFields(page: Page, task: SkillTasks) {
    this.log.debug(`Type form`);

    const { productName, productDescription, count, tone } = task;

    await page.click('#nValue', { clickCount: task.count }); // select all and prepare to replace
    await page.type('#companyName', productName, { delay: 1 });
    await page.type('#productDescription', productDescription, { delay: 1 });
    await page.type('#tone', tone, { delay: 1 });
    await page.type('#nValue', String(count), { delay: 1 });
  }
}
