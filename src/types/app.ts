import { Page } from 'puppeteer';
import { AdsOptions, Options, SkillOptions } from './jarvis-ai';

export interface TaskBasicOptions {
  name: TaskNames;
  type: TaskTypes;
}

export type Task<T extends Options> = TaskBasicOptions & T;

export type SkillTask<T = SkillOptions> = Task<T> & {
  type: TaskTypes.Skill;
};

export type SkillTasks = SkillTask<AdsOptions>;

export type ComplicateTask<T extends Options> = Task<T> & {
  type: TaskTypes.Complicate;
};

export type ComplicateTasks = ComplicateTask<AdsOptions>;

export type Tasks = SkillTasks | ComplicateTasks;

export interface TaskHandler {
  handle: (page: Page, task: Tasks, saveResult?: boolean) => Promise<any[]>;
}

export type TaskHandlers = TaskHandler;

export enum TaskNames {
  // complicate
  GenerateGoogleAdsContent = 'generate-google-ads-content',

  // skill
  GenerateGoogleAdsHeadline = 'generate-google-ads-headline',
  GenerateGoogleAdsDescription = 'generate-google-ads-description',
}

export enum TaskTypes {
  Complicate = 'complicate',
  Skill = 'skill',
}
