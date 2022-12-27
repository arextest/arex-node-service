import { RunEnv } from 'src/apps/test/model/runenv';
import { RunVar } from 'src/apps/test/model/runvar';
import { CaseRequest } from '../model/caserequest';
import { CaseSendRequest } from '../model/casesendrequest';
import { CaseSendResponse } from '../model/casesendresponse';

export class ExceptionHandleService {
  static addException(casestatus: number, message: string): CaseSendResponse {
    const caseSendResponse = new CaseSendResponse();
    caseSendResponse.caseStatus = casestatus;
    caseSendResponse.exceptionMsg = message;
    return caseSendResponse;
  }

  static addExceptionAndResponse(
    backFillRelatedInfo,
    casestatus: number,
    message: string,
    caseRequest: CaseRequest,
    envList: RunEnv[],
    varList: RunVar[],
    res?: any[],
  ): CaseSendResponse {
    const caseSendResponse = new CaseSendResponse();
    caseSendResponse.caseStatus = casestatus;
    caseSendResponse.exceptionMsg = message;
    backFillRelatedInfo(caseSendResponse, caseRequest);
    caseSendResponse.envList = envList;
    caseSendResponse.varList = varList;
    if (res && res.length == 1) {
      caseSendResponse.response = JSON.stringify(res[0].body);
    }
    if (res && res.length == 2) {
      caseSendResponse.baseResponse = JSON.stringify(res[0].body);
      caseSendResponse.testResponse = JSON.stringify(res[1].body);
    }
    return caseSendResponse;
  }
}
