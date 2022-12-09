import { RunEnv } from '../../test/model/runenv';
import { RunVar } from '../../test/model/runvar';
import { Address } from './address';
import { KeyValuePairType } from './keyvaluepairType';

export class CaseSendRequest {
  address: Address;
  headers: Array<KeyValuePairType>;
  params: Array<KeyValuePairType>;
  body: string;
  preTestScripts: Array<string>;
  testScript: string;

  baseAddress: Address;
  testAddress: Address;

  envList: Array<RunEnv>;
  varList: Array<RunVar>;
}
