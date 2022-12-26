import { Inject, Injectable } from '@nestjs/common';
import { forkJoin } from 'rxjs';
import { RunVar } from '../../test/model/runvar';
import { CaseResult } from '../../test/model/caseresult';
import { RunEnv } from '../../test/model/runenv';
import { PreTestService } from '../../test/service/pretest.service';
import { CaseRequest } from '../model/caserequest';
import { CaseSendRequest } from '../model/casesendrequest';
import { CaseSendResponse } from '../model/casesendresponse';
import { CaseHandleFactoryService } from './casehandlefactory.service';
import { ProprecessService } from './preprocess.service';

@Injectable()
export class CaseSendService {
  @Inject()
  private readonly preTestService: PreTestService;

  @Inject()
  private readonly preprocessService: ProprecessService;

  @Inject()
  private readonly caseHandleFactoryService: CaseHandleFactoryService;

  async caseSend(caseSendRequest: CaseSendRequest): Promise<CaseSendResponse> {
    return new Promise(async (resolve, reject) => {
      try {
        const caseTestResult = new CaseResult('root', [], []);

        let envList = caseSendRequest.envList || new Array<RunEnv>();
        let varList = caseSendRequest.varList || new Array<RunVar>();
        const caseRequest = this.buildRequest(caseSendRequest);
        const preTestScripts = caseSendRequest.preTestScripts;
        const testScript = caseSendRequest.testScript;
        const sendTimeout = caseSendRequest.sendTimeout;

        if (preTestScripts && preTestScripts.length !== 0) {
          const preScriptResult = await this.preTestService.runPreTestScript(
            caseRequest,
            envList,
            varList,
            preTestScripts,
          );
          caseTestResult.children.push(
            ...(preScriptResult.caseResult.children || []),
          );
          envList = preScriptResult.envList || [];
          varList = preScriptResult.varList || [];
        }

        // 预处理request, url, header; 环境变量替换
        this.preprocessService.preprocess(caseRequest, envList, varList);

        // 发送请求
        const caseHandleService =
          this.caseHandleFactoryService.select(caseRequest);
        const sendTasks = caseHandleService.buildSendTasks(
          caseRequest,
          sendTimeout,
        );

        const observables = forkJoin([...sendTasks]);
        const res = await new Promise<Array<any>>((resolve, reject) => {
          observables.subscribe(
            (item) => {
              resolve(item);
            },
            (error) => {
              reject(error);
            },
          );
        });

        const caseSendResponse = await caseHandleService.processSendResponse(
          res,
          caseRequest,
          envList,
          varList,
          testScript,
          caseTestResult,
        );
        caseHandleService.backFillRelatedInfo(caseSendResponse, caseRequest);
        resolve(caseSendResponse);
      } catch (error) {
        reject(error);
        return;
      }
    });
  }

  private buildRequest(caseSendRequest: CaseSendRequest): CaseRequest {
    const caserequest = new CaseRequest();
    caserequest.headers = caseSendRequest.headers;
    caserequest.params = caseSendRequest.params;
    caserequest.body = caseSendRequest.body;
    caserequest.address = caseSendRequest.address;
    caserequest.baseAddress = caseSendRequest.baseAddress;
    caserequest.testAddress = caseSendRequest.testAddress;
    return caserequest;
  }
}
