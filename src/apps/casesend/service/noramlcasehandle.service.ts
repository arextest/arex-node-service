import { Inject, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
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

  public buildSendTasks(caseRequest: CaseRequest): Observable<any>[] {
    const sendTasks = [];
    sendTasks.push(
      this.buildSendTaskSerive.sendRequest(
        caseRequest.headers,
        caseRequest.body,
        caseRequest.address,
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
  ): Promise<CaseSendResponse> {
    const response = res[0];

    const caseSendResponse = new CaseSendResponse();
    caseSendResponse.response = JSON.stringify(response.body);
    const testExecResult = await this.preTestService.runPreTestScript(
      req,
      envList,
      varList,
      [testScript],
      response,
    );

    testExecResult.caseResult.children.push(...caseTestResult.children);
    caseSendResponse.testResult = JSON.stringify(testExecResult.caseResult);
    caseSendResponse.caseStatus = this.judgeCaseStatus(
      testExecResult.caseResult,
    );
    caseSendResponse.envList = testExecResult.envList;
    caseSendResponse.varList = testExecResult.varList;
    return Promise.resolve(caseSendResponse);
  }

  public backFillRelatedInfo(
    caseSendResponse: CaseSendResponse,
    caseRequest: CaseRequest,
  ) {
    caseSendResponse.addresss = caseRequest.address;
    caseSendResponse.headers = caseRequest.headers;
    caseSendResponse.request = caseRequest.body;
  }
}
