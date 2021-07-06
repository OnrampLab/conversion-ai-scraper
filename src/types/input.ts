import { Tasks } from './app';

export interface Input {
  proxy: any;
  task: Tasks;
  debugLog: boolean;
  useStealth: boolean;
  useChrome: boolean;
}
