import { Page } from 'puppeteer';
import { clickAndScreenshot } from './clickAndScreenshot';

export const goBackToTemplatesPage = async (page: Page) => {
  const targetText = 'Templates';
  await clickAndScreenshot(
    page,
    targetText,
    `//button[@content="${targetText}"]`,
    `//h2[contains(., "${targetText}")]`,
  );
};
