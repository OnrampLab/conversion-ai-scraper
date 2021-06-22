import Apify from 'apify';
import { Log } from 'apify-shared/log';
import { errors } from '../errors';
import { TaskHandlers, TaskNames, Tasks } from '../types';
import { TaskFactory } from './core/TaskFactory';
import {
  GoogleAdsContentHandler,
  GoogleAdsDescriptionHandler,
  GoogleAdsHeadlineHandler,
} from './googleAds';

const {
  utils: { log },
} = Apify;

type Factory = Record<string, TaskHandlers>;

export class HandlerFactory {
  protected static log: Log = log.child({ prefix: 'HandlerFactory' });
  protected static mapping;

  static getMapping(type: string, name: string) {
    // NOTE: to delay the initialization in order to get correct log level
    if (!this.mapping) {
      this.mapping = {
        complicate: {
          [TaskNames.GenerateGoogleAdsContent]: GoogleAdsContentHandler.create(),
        },
        skill: {
          [TaskNames.GenerateGoogleAdsHeadline]: GoogleAdsHeadlineHandler.create(),
          [TaskNames.GenerateGoogleAdsDescription]: GoogleAdsDescriptionHandler.create(),
        },
      };
    }

    return this.mapping[type][name];
  }

  static createHandler(task: Tasks): TaskHandlers {
    const { type, name } = TaskFactory.createTask(task);

    const handler = this.getMapping(type, name);

    log.debug('Getting handler', { type, name, handler: typeof handler });

    if (!handler) {
      throw errors.taskHandlerNotFound(name);
    }

    return handler;
  }
}
