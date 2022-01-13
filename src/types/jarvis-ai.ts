export interface Options {}

export interface AdsOptions extends Options {
  tone: string;
  productName: string;
  productDescription: string;
  count: number;
  examples?: string[];
}

export type SkillOptions = AdsOptions;

export interface CreativeStoryOptions extends Options {
  tone: string;
  plot: string;
  count: number;
}

export interface Skill {
  id: string;
  name: string;
  beta: boolean;
  description: string;
  emoji: string;
  icon: string;
  type: string;
  updated_at: string;
}
