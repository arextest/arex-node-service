import { MapEnv } from './mapenv';

export abstract class TestField {
  request?: {} | undefined;
  response?: {} | undefined;
  environment?: MapEnv | undefined;
}
