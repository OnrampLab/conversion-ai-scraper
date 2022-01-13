import { AbstractGoogleAdsSkillHandler } from './AbstractGoogleAdsSkillHandler';

export class GoogleAdsDescriptionHandler extends AbstractGoogleAdsSkillHandler {
  constructor() {
    super('Google Ads Description', 'description');
  }

  static create() {
    return new GoogleAdsDescriptionHandler();
  }
}
