import { Observable } from 'rxjs';
import { RunEnv } from 'src/apps/test/model/runenv';
import { RunVar } from 'src/apps/test/model/runvar';
import { CaseResult } from '../../test/model/caseresult';
import { CaseRequest } from '../model/caserequest';
import { CaseSendResponse } from '../model/casesendresponse';
import { CaseStatus } from '../model/casestatus';

export abstract class CaseHandleService {
  abstract isSupport(caseRequest: CaseRequest): boolean;

  abstract buildSendTasks(
    caseRequest: CaseRequest,
    sendTimeout: number,
  ): Array<Observable<any>>;

  abstract processSendResponse(
    res: Array<any>,
    req: CaseRequest,
    envList: Array<RunEnv>,
    varList: Array<RunVar>,
    testScript: string,
    caseTestResult: CaseResult,
  ): Promise<CaseSendResponse>;

  abstract backFillRelatedInfo(
    caseSendResponse: CaseSendResponse,
    caseRequest: CaseRequest,
  );

  judgeCaseStatus(caseResult: CaseResult): number {
    let caseStatus = CaseStatus.NO_PROBLEM;
    const childrenArray = caseResult.children;
    for (let i = 0; i < childrenArray.length; i++) {
      const children = childrenArray[i];
      const expectResult = children.expectResults;
      for (let j = 0; j < expectResult.length; j++) {
        const element = expectResult[j];
        if (element.status === 'fail') {
          caseStatus = CaseStatus.HAVE_PROBLEM;
          break;
        }
      }
    }
    return caseStatus;
  }
}
