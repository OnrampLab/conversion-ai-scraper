import Apify, { pushData } from 'apify';
import { Log } from 'apify-shared/log';
import { merge } from 'lodash';
import { Page } from 'puppeteer';
import { InfoError } from '../../../errors';
import {
  AdsOptions,
  ComplicateTasks,
  SkillTask,
  SkillTasks,
  TaskNames,
  Tasks,
  TaskTypes
} from '../../../types';
import { goBackToTemplatesPage } from '../../../utils';
import { HandlerFactory } from '../../HandlerFactory';
import { TaskFactory } from '../TaskFactory';
import { AbstractHandler } from './AbstractHandler';

const {
  utils: { log },
} = Apify;

export abstract class AbstractAdsComplicateHandler extends AbstractHandler {
  protected name: string;
  protected dataKey: string;
  protected log: Log;

  constructor(name: string, dataKey: string) {
    super();

    this.name = name;
    this.dataKey = dataKey;
    this.log = log.child({ prefix: this.constructor.name });
  }

  abstract getSkillTasks(task: Tasks): SkillTask[];

  async handle(page: Page, task: Tasks, saveResult: boolean = true): Promise<any[]> {
    try {
      this.log.info('Start handling complicate task', { task });

      const skillTasks = this.getSkillTasks(task);
      const results: any[] = await this.handleTasks(skillTasks, page);

      const items = this.merge(results, task, page);

      if (saveResult) {
        await pushData(items);
      }

      return items;
    } catch (error) {
      if (error instanceof InfoError) {
        throw error;
      }

      this.log.error('Failed handle task', { error });

      throw new InfoError(`Failed to ${this.name}`, {
        namespace: this.name,
        url: page.url(),
      });
    }
  }

  private async handleTasks(skillTasks: SkillTask<AdsOptions>[], page: Page): Promise<any[]> {
    return await skillTasks.reduce<Promise<any[]>>(async (resultsP, task, index) => {
      const results = await resultsP;

      const handler = HandlerFactory.createHandler(task);
      const result = await handler.handle(page, task, false);

      if (index + 1 < skillTasks.length) {
        await goBackToTemplatesPage(page);
      }

      results.push(result);

      return results;
    }, Promise.resolve([]));
  }

  private merge(results: any[], task: Tasks, page: Page) {
    try {
      this.log.info('Merging results', { results });

      const items = merge([], ...results).map(item => ({
        task: task.name,
        ...item,
        created_at: new Date().toISOString(),
      }));

      this.log.info('Merged results', { items });
      return items;
    } catch (error) {
      this.log.error('Merging error', { error });

      throw error;
    }
  }

  protected toAdsSkillTask(task: ComplicateTasks, adsTaskName: TaskNames): SkillTasks {
    return TaskFactory.createTask({
      ...task,
      name: adsTaskName,
      type: TaskTypes.Skill,
    }) as SkillTasks;
  }
}
