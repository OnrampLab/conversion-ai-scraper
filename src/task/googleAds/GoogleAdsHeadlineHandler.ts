import { AbstractGoogleAdsSkillHandler } from './AbstractGoogleAdsSkillHandler';

export class GoogleAdsHeadlineHandler extends AbstractGoogleAdsSkillHandler {
  constructor() {
    super('Google Ads Headline', 'headline');
  }

  static create() {
    return new GoogleAdsHeadlineHandler();
  }
}
