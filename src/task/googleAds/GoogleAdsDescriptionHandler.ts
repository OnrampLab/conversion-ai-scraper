import { AbstractGoogleAdsSkillHandler } from './AbstractGoogleAdsSkillHandler';

export class GoogleAdsDescriptionHandler extends AbstractGoogleAdsSkillHandler {
  constructor() {
    super('Google ads description', 'description');
  }

  static create() {
    return new GoogleAdsDescriptionHandler();
  }
}
