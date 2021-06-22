import { ComplicateTasks, SkillTask, TaskNames, Tasks } from '../../types';
import { AbstractAdsComplicateHandler } from '../core/handlers/AbstractAdsComplicateHandler';

export class GoogleAdsContentHandler extends AbstractAdsComplicateHandler {
  constructor() {
    super('Google ads content', 'content');
  }

  static create() {
    return new GoogleAdsContentHandler();
  }

  getSkillTasks(task: Tasks): SkillTask[] {
    const headlineTask = this.toAdsSkillTask(
      task as ComplicateTasks,
      TaskNames.GenerateGoogleAdsHeadline,
    );

    const descriptionTask = this.toAdsSkillTask(
      task as ComplicateTasks,
      TaskNames.GenerateGoogleAdsDescription,
    );

    return [headlineTask, descriptionTask];
  }
}
