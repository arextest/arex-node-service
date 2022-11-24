import { Inject, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CaseResult } from '../../test/model/caseresult';
import { TestService } from '../../test/service/test.service';
import { CaseRequest } from '../model/caserequest';
import { CaseSendResponse } from '../model/casesendresponse';
import { BuildSendTaskSerive } from './buildsendtask.servce';
import { CaseHandleService } from './casehandle.service';

@Injectable()
export class DoubleCaseHandleService extends CaseHandleService {
  @Inject()
  private readonly buildSendTaskSerive: BuildSendTaskSerive;

  @Inject()
  private readonly testService: TestService;

  isSupport(caseRequest: CaseRequest): boolean {
    return caseRequest.baseAddress !== undefined;
  }

  public buildSendTasks(caseRequest: CaseRequest): Observable<any>[] {
    const sendTasks = [];
    sendTasks.push(
      this.buildSendTaskSerive.sendRequest(
        caseRequest.headers,
        caseRequest.body,
        caseRequest.baseAddress,
      ),
    );
    sendTasks.push(
      this.buildSendTaskSerive.sendRequest(
        caseRequest.headers,
        caseRequest.body,
        caseRequest.testAddress,
      ),
    );
    return sendTasks;
  }

  public async processSendResponse(
    res: Array<any>,
    req: CaseRequest,
    testScript: string,
    caseTestResult: CaseResult,
  ): Promise<CaseSendResponse> {
    const baseResponse = res[0];
    const testResponse = res[1];
    if (typeof baseResponse === 'string' || typeof testResponse === 'string') {
      throw new Error(
        typeof baseResponse === 'string' ? baseResponse : testResponse,
      );
    }

    const caseSendResponse = new CaseSendResponse();
    caseSendResponse.baseResponse = JSON.stringify(baseResponse.body);
    caseSendResponse.testResponse = JSON.stringify(testResponse.body);

    const baseTestResult = await this.testService.runTestScript(testScript, {
      request: req,
      response: baseResponse,
    });
    const testTestResult = await this.testService.runTestScript(testScript, {
      request: req,
      response: testResponse,
    });

    baseTestResult.caseResult.children.push(...caseTestResult.children);
    testTestResult.caseResult.children.push(...caseTestResult.children);

    caseSendResponse.baseTestResult = JSON.stringify(baseTestResult.caseResult);
    caseSendResponse.testTestResult = JSON.stringify(testTestResult.caseResult);
    caseSendResponse.caseStatus =
      this.judgeCaseStatus(baseTestResult.caseResult) &&
      this.judgeCaseStatus(testTestResult.caseResult);
    return Promise.resolve(caseSendResponse);
  }

  public backFillRelatedInfo(
    caseSendResponse: CaseSendResponse,
    caseRequest: CaseRequest,
  ) {
    caseSendResponse.baseUrl = caseRequest.baseAddress.endpoint;
    caseSendResponse.testUrl = caseRequest.testAddress.endpoint;

    caseSendResponse.headers = caseRequest.headers;
    caseSendResponse.request = caseRequest.body;
  }
}
