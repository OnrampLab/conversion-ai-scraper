import { AbstractGoogleAdsSkillHandler } from './AbstractGoogleAdsSkillHandler';

export class GoogleAdsHeadlineHandler extends AbstractGoogleAdsSkillHandler {
  constructor() {
    super('Google ads headline', 'headline');
  }

  static create() {
    return new GoogleAdsHeadlineHandler();
  }
}
