import { Page } from 'puppeteer';
import { TaskHandler, Tasks } from '../../../types';

export abstract class AbstractHandler implements TaskHandler {
  abstract handle(page: Page, task: Tasks, saveResult: boolean): Promise<any[]>;
}
