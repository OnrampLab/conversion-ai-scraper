import { errors } from '../../errors';
import { AdsOptions, ComplicateTask, SkillTask, TaskNames, Tasks } from '../../types';

export class TaskFactory {
  static createTask(task: Tasks): Tasks {
    const { name } = task;

    switch (task.name) {
      case TaskNames.GenerateGoogleAdsContent:
        return task as ComplicateTask<AdsOptions>;
        break;

      case TaskNames.GenerateGoogleAdsHeadline:
      case TaskNames.GenerateGoogleAdsDescription:
        return task as SkillTask<AdsOptions>;

      default:
        throw errors.taskHandlerNotFound(name);
    }
  }
}
