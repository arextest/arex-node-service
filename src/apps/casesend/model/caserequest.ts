import { Address } from './address';
import { KeyValuePairType } from './keyvaluepairType';

export class CaseRequest {
  address: Address;
  headers: Array<KeyValuePairType>;
  params: Array<KeyValuePairType>;
  body: object;
  originBody: string;
  baseAddress: Address;
  testAddress: Address;
}
