import { Inject, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PreTestScriptResponse } from '../../test/model/pretestscriptresponse';
import { CaseResult } from '../../test/model/caseresult';
import { RunEnv } from '../../test/model/runenv';
import { RunVar } from '../../test/model/runvar';
import { PreTestService } from '../../test/service/pretest.service';
import { CaseRequest } from '../model/caserequest';
import { CaseSendResponse } from '../model/casesendresponse';
import { BuildSendTaskSerive } from './buildsendtask.servce';
import { CaseHandleService } from './casehandle.service';
import { HeaderHandleUtil } from '../utils/headerhandleutil';

@Injectable()
export class NoramlCaseHandleService extends CaseHandleService {
  @Inject()
  private readonly buildSendTaskSerive: BuildSendTaskSerive;

  @Inject()
  private readonly preTestService: PreTestService;

  public isSupport(caseRequest: CaseRequest): boolean {
    return caseRequest.baseAddress === undefined;
  }

  public buildSendTasks(
    caseRequest: CaseRequest,
    caseTimeout: number,
  ): Observable<any>[] {
    const sendTasks = [];
    sendTasks.push(
      this.buildSendTaskSerive.sendRequest(
        caseRequest.headers,
        caseRequest.body,
        caseRequest.address,
        caseTimeout,
      ),
    );
    return sendTasks;
  }

  public async processSendResponse(
    res: Array<any>,
    req: CaseRequest,
    envList: Array<RunEnv>,
    varList: Array<RunVar>,
    testScript: string,
    caseTestResult: CaseResult,
  ): Promise<Array<PreTestScriptResponse>> {
    const response = res[0];

    const testExecResult = await this.preTestService.runPreTestScript(
      req,
      envList,
      varList,
      [testScript],
      response,
    );
    testExecResult.caseResult.children.push(...caseTestResult.children);
    return Promise.resolve([testExecResult]);
  }

  public backFillRelatedInfo(
    caseSendResponse: CaseSendResponse,
    caseRequest: CaseRequest,
    res: Array<any>,
    testExecResultArr: Array<PreTestScriptResponse>,
  ) {
    caseSendResponse.addresss = caseRequest.address;
    caseSendResponse.reqHeaders = caseRequest.headers;
    caseSendResponse.params = caseRequest.params;
    caseSendResponse.request = caseRequest.body;
    if (res) {
      const response = res[0];
      caseSendResponse.headers = HeaderHandleUtil.transformHeader(
        response.headers,
      );
      caseSendResponse.response = JSON.stringify(response.body);
    }
    if (testExecResultArr) {
      const testExecResult = testExecResultArr[0];
      caseSendResponse.testResult = JSON.stringify(testExecResult.caseResult);
      caseSendResponse.caseStatus = this.judgeCaseStatus(
        testExecResult.caseResult,
      );
      caseSendResponse.envList = testExecResult.envList;
      caseSendResponse.varList = testExecResult.varList;
    }
  }
}
