import { Tasks } from './app';

export interface Input extends Credentials {
  proxy: any;
  task: Tasks;
  debugLog: boolean;
}

export interface Credentials {
  loginUsername: string;
  loginPassword: string;
}
