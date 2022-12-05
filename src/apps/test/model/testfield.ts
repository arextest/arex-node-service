import { MapEnv } from './mapenv';
import { MapVar } from './mapvar';

export abstract class TestField {
  request?: {} | undefined;
  response?: {} | undefined;
  environment?: MapEnv | undefined;
  variables?: MapVar | undefined;
}
