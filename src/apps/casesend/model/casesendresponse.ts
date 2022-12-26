import { RunEnv } from '../../test/model/runenv';
import { RunVar } from '../../test/model/runvar';
import { Address } from './address';
import { KeyValuePairType } from './keyvaluepairType';

export class CaseSendResponse {
  // 无差异：0，有差异：1，其它异常：2， 前置脚本执行异常：3, 发送异常：4, test脚本异常：5
  caseStatus: number;
  // 填写异常信息
  exceptionMsg: string;

  // 回填url
  addresss: Address;

  // 回填header
  headers: Array<KeyValuePairType>;

  // 回填params
  params: Array<KeyValuePairType>;

  // 回填request
  request: string;
  response: string;

  testResult: string;

  envList: Array<RunEnv>;
  varList: Array<RunVar>;

  baseAddress: Address;
  testAddress: Address;
  baseResponse: string;
  testResponse: string;
  baseTestResult: string;
  testTestResult: string;
}
