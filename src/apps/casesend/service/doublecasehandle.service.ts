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
export class DoubleCaseHandleService extends CaseHandleService {
  @Inject()
  private readonly buildSendTaskSerive: BuildSendTaskSerive;

  @Inject()
  private readonly preTestService: PreTestService;

  isSupport(caseRequest: CaseRequest): boolean {
    return caseRequest.baseAddress !== undefined;
  }

  public buildSendTasks(
    caseRequest: CaseRequest,
    sendTimeout: number,
  ): Observable<any>[] {
    const sendTasks = [];
    sendTasks.push(
      this.buildSendTaskSerive.sendRequest(
        caseRequest.headers,
        caseRequest.body,
        caseRequest.baseAddress,
        sendTimeout,
      ),
    );
    sendTasks.push(
      this.buildSendTaskSerive.sendRequest(
        caseRequest.headers,
        caseRequest.body,
        caseRequest.testAddress,
        sendTimeout,
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
    const baseResponse = res[0];
    const testResponse = res[1];

    const baseTestExecResult = await this.preTestService.runPreTestScript(
      req,
      envList,
      varList,
      [testScript],
      baseResponse,
    );
    const testTestExecResult = await this.preTestService.runPreTestScript(
      req,
      envList,
      varList,
      [testScript],
      testResponse,
    );

    baseTestExecResult.caseResult.children.push(...caseTestResult.children);
    testTestExecResult.caseResult.children.push(...caseTestResult.children);
    return Promise.resolve([baseTestExecResult, testTestExecResult]);
  }

  public backFillRelatedInfo(
    caseSendResponse: CaseSendResponse,
    caseRequest: CaseRequest,
    res: Array<any>,
    testExecResultArr: Array<PreTestScriptResponse>,
  ) {
    caseSendResponse.baseAddress = caseRequest.baseAddress;
    caseSendResponse.testAddress = caseRequest.testAddress;
    caseSendResponse.headers = caseRequest.headers;
    caseSendResponse.params = caseRequest.params;
    caseSendResponse.request = caseRequest.body;

    if (res) {
      const baseResponse = res[0];
      const testResponse = res[1];
      caseSendResponse.baseHeaders = HeaderHandleUtil.transformHeader(
        baseResponse.headers,
      );
      caseSendResponse.baseResponse = JSON.stringify(baseResponse.body);
      caseSendResponse.testHeaders = HeaderHandleUtil.transformHeader(
        testResponse.headers,
      );
      caseSendResponse.testResponse = JSON.stringify(testResponse.body);
    }

    if (testExecResultArr) {
      const baseTestExecResult = testExecResultArr[0];
      const testTestExecResult = testExecResultArr[1];
      caseSendResponse.baseTestResult = JSON.stringify(
        baseTestExecResult.caseResult,
      );
      caseSendResponse.testTestResult = JSON.stringify(
        testTestExecResult.caseResult,
      );
      caseSendResponse.caseStatus =
        this.judgeCaseStatus(baseTestExecResult.caseResult) &&
        this.judgeCaseStatus(testTestExecResult.caseResult);
      caseSendResponse.envList = testTestExecResult.envList;
      caseSendResponse.varList = testTestExecResult.varList;
    }
  }
}
