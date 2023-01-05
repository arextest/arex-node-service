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
        caseRequest.originBody,
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
    this.addOriginResponse(response);
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
    caseSendResponse.request = caseRequest.originBody;
    if (res) {
      const response = res[0];
      caseSendResponse.headers = response.headers;
      caseSendResponse.response = response.originBody;
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
