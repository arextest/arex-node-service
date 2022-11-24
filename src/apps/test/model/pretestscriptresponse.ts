import { Address } from '../../casesend/model/address';
import { KeyValuePairType } from '../../casesend/model/keyvaluepairType';
import { CaseResult } from './caseresult';
import { RunEnv } from './runenv';

export class PreTestScriptResponse {
  address: Address;
  headers: Array<KeyValuePairType>;
  body: string;
  envList: Array<RunEnv>;

  baseAddress: Address;
  testAddress: Address;

  caseResult: CaseResult;
}
