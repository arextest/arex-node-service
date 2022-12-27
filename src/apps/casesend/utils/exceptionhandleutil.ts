import { RunEnv } from '../../test/model/runenv';
import { RunVar } from '../../test/model/runvar';
import { CaseRequest } from '../model/caserequest';
import { CaseSendResponse } from '../model/casesendresponse';

export class ExceptionHandleUtil {
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
    backFillRelatedInfo(caseSendResponse, caseRequest, res, undefined);
    caseSendResponse.envList = envList;
    caseSendResponse.varList = varList;
    return caseSendResponse;
  }
}
