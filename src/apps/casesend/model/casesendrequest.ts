import { Address } from './address';
import { KeyValuePairType } from './keyvaluepairType';

export class CaseSendRequest {
  address: Address;
  headers: Array<KeyValuePairType>;
  body: string;
  preTestScripts: Array<string>;
  testScript: string;

  baseAddress: Address;
  testAddress: Address;
}
