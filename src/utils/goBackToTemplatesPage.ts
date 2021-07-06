import { Page } from 'puppeteer';
import { click } from './click';

export const goBackToTemplatesPage = async (page: Page) => {
  const targetText = 'Templates';
  await click(
    page,
    targetText,
    `//button[@content="${targetText}"]`,
    `//h2[contains(., "${targetText}")]`,
  );
};
