import { Inject, Injectable } from "@nestjs/common";
import { forkJoin } from "rxjs";
import { CaseResult } from "../../test/model/caseresult";
import { RunEnv } from "../../test/model/runenv";
import { PreTestService } from "../../test/service/pretest.service";
import { TestService } from "../../test/service/test.service";
import { CaseRequest } from "../model/caserequest";
import { CaseSendRequest } from "../model/casesendrequest";
import { CaseSendResponse } from "../model/casesendresponse";
import { CaseHandleFactoryService } from "./casehandlefactory.service";
import { ProprecessService } from "./preprocess.service";

@Injectable()
export class CaseSendService {

    @Inject()
    private readonly testService: TestService;

    @Inject()
    private readonly preTestService: PreTestService;

    @Inject()
    private readonly preprocessService: ProprecessService;


    @Inject()
    private readonly caseHandleFactoryService: CaseHandleFactoryService;

    async caseSend(caseSendRequest: CaseSendRequest): Promise<CaseSendResponse> {

        return new Promise(async (resolve, reject) => {
            const caseTestResult = new CaseResult("root", [], []);

            let envList = new Array<RunEnv>;
            let caseRequest = this.buildRequest(caseSendRequest);
            let preTestScripts = caseSendRequest.preTestScripts;
            let testScript = caseSendRequest.testScript;


            if (preTestScripts && preTestScripts.length !== 0) {
                try {
                    let preScriptResult = await this.preTestService.runPreTestScript(caseRequest, envList, preTestScripts);
                    caseTestResult.children.push(...(preScriptResult.caseResult.children || []));
                    envList = preScriptResult.envList || []
                } catch (error) {
                    reject(error);
                    return;
                }
            }

            // 预处理request, url, header; 环境变量替换
            this.preprocessService.preprocess(caseRequest, envList);

            // 发送请求
            let caseHandleService = this.caseHandleFactoryService.select(caseRequest);
            let sendTasks = caseHandleService.buildSendTasks(caseRequest);

            let observables = forkJoin([...sendTasks]);
            const res = await new Promise<Array<any>>(
                (resolve) => {
                    observables.subscribe(item => {
                        resolve(item)
                    })
                }
            );

            try {
                let caseSendResponse = await caseHandleService.processSendResponse(res, caseRequest, testScript, caseTestResult);
                caseHandleService.backFillRelatedInfo(caseSendResponse, caseRequest);
                resolve(caseSendResponse);
            } catch (error) {
                reject(error);
                return;
            }
        })


    }

    private buildRequest(caseSendRequest: CaseSendRequest): CaseRequest {
        let caserequest = new CaseRequest();
        caserequest.headers = caseSendRequest.headers;
        caserequest.body = caseSendRequest.body;
        caserequest.address = caseSendRequest.address;
        caserequest.baseAddress = caseSendRequest.baseAddress;
        caserequest.testAddress = caseSendRequest.testAddress;
        return caserequest;
    }

}

