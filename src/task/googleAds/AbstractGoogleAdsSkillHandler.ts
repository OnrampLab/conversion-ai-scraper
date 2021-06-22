import Apify from 'apify';
import { Log } from 'apify-shared/log';
import { Page } from 'puppeteer';
import { InfoError } from '../../errors';
import { SkillTasks } from '../../types';
import { AbstractAdsSkillHandler } from '../core/handlers/AbstractAdsSkillHandler';

const {
  utils: { log },
} = Apify;

const CSS_SELECTORS = {
  PRODUCT_NAME: '#companyName',
  PRODUCT_DESCRIPTION: '#productDescription',
  TONE: '#tone',
  COUNT: '#nValue',
};

export abstract class AbstractGoogleAdsSkillHandler extends AbstractAdsSkillHandler {
  protected name: string;
  protected dataKey: string;
  protected log: Log;

  protected async fillFormFields(page: Page, task: SkillTasks) {
    let action: string;

    try {
      this.log.debug(`Start filling form fields`);

      const { productName, productDescription, count, tone } = task;

      this.log.debug((action = `Input company name`), { productName });
      await page.type(CSS_SELECTORS.PRODUCT_NAME, productName);

      this.log.debug((action = `Input product description`), { productDescription });
      await page.type(CSS_SELECTORS.PRODUCT_DESCRIPTION, productDescription);

      this.log.debug((action = `Input tone`), { tone });
      await page.type(CSS_SELECTORS.TONE, tone);

      this.log.debug((action = `Input count`), { count });
      await page.click(CSS_SELECTORS.COUNT, { clickCount: 3 }); // select all and prepare to replace
      await page.type(CSS_SELECTORS.COUNT, String(count));
    } catch (error) {
      if (error instanceof InfoError) {
        throw error;
      }

      log.exception(error as Error, 'Failed to fill form fields', error);

      throw new InfoError(`Failed to fill form fields`, {
        namespace: this.name,
        url: page.url(),
      });
    }
  }
}
