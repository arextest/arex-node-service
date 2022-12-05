import { KeyValuePairType } from '../../../../src/apps/casesend/model/keyvaluepairType';
import { Address } from '../../../../src/apps/casesend/model/address';
import { RunEnv } from './runenv';
import { RunVar } from './runvar';

export class PreTestScriptRequest {
  address: Address;
  headers: Array<KeyValuePairType>;
  body: string;
  preTestScripts: Array<string>;

  baseAddress: Address;
  testAddress: Address;

  envList: Array<RunEnv>;
  varList: Array<RunVar>;
}
