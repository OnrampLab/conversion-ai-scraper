import Apify, { pushData } from 'apify';
import { Log } from 'apify-shared/log';
import { Page } from 'puppeteer';
import { InfoError } from '../../../errors';
import { SkillTask, SkillTasks, Tasks } from '../../../types';
import { clickAndScreenshot } from '../../../utils';
import { AbstractHandler } from './AbstractHandler';

const {
  utils: { log },
} = Apify;

export abstract class AbstractAdsSkillHandler extends AbstractHandler {
  protected name: string;
  protected dataKey: string;
  protected log: Log;

  constructor(name: string, dataKey: string) {
    super();

    this.name = name;
    this.dataKey = dataKey;
    this.log = log.child({ prefix: this.constructor.name });
  }

  protected abstract fillFormFields(page: Page, task: SkillTasks): Promise<void>;

  async handle(page: Page, task: Tasks, saveResult: boolean = true): Promise<any[]> {
    try {
      this.log.info('Start handling skill task', { task, url: page.url() });

      await page.waitForXPath(`//button/div[contains(., "${this.name}")]`, {
        visible: true,
        timeout: 15000,
      });

      await this.goToSkillPage(page);

      await this.clearInputs(page);

      await this.fillForm(page, task as SkillTask);

      await this.submitForm(page);

      const contents = await this.getResult(page);

      if (saveResult) {
        await this.saveResult(contents, page);
      }

      return contents;
    } catch (error) {
      if (error instanceof InfoError) {
        throw error;
      }

      log.exception(error as Error, `Failed handle task`, error);

      throw new InfoError(`Failed handle task`, {
        namespace: this.name,
        url: page.url(),
      });
    }
  }

  private async goToSkillPage(page: Page) {
    const url = await page.evaluate(() => window.location.href);
    this.log.info('Page opened.', { url });

    await clickAndScreenshot(
      page,
      this.name,
      `//button/div[contains(., "${this.name}")]`,
      `//h1[contains(., "${this.name}")]`,
    );
  }

  private async clearInputs(page: Page) {
    this.log.debug(`Clear inputs`);
    const [button] = await page.$x(`//button/div[contains(., "Clear inputs")]`);
    await button.click();
  }

  private async fillForm(page: Page, task: SkillTasks) {
    await this.fillFormFields(page, task);
  }

  private async submitForm(page: Page) {
    this.log.debug(`Submit form`, { dataKey: this.dataKey });
    const submitButton = 'form button[type="submit"]';
    await page.click(submitButton);

    await page.waitForSelector('pre', {
      visible: true,
      timeout: 30000,
    });
  }

  private async getResult(page: Page) {
    const texts: string[] = await page.evaluate(dataKey =>
      Array.from(document.querySelectorAll('pre')).map(element => element.innerText),
    );

    const contents = texts.map(text => ({
      [this.dataKey]: text,
    }));
    return contents;
  }

  private async saveResult(contents: { [x: string]: string }[], page: Page) {
    const result = contents.map(content => ({ ...content, '#url': page.url() }));
    await pushData(result);
  }
}
