import { KeyValuePairType } from './keyvaluepairType';

export class CaseSendResponse {
  // 无差异：0，有差异：1，发送异常：2
  caseStatus: number;
  // 填写异常信息
  exceptionMsg: string;

  // 回填url
  url: string;
  baseUrl: string;
  testUrl: string;

  // 回填header
  headers: Array<KeyValuePairType>;

  // 回填request
  request: string;

  response: string;
  baseResponse: string;
  testResponse: string;

  testResult: string;
  baseTestResult: string;
  testTestResult: string;
}
