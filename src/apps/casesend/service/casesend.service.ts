import { Inject, Injectable } from "@nestjs/common";
import { forkJoin } from "rxjs";
import { TestService } from "src/apps/test/test.service";
import { ResponseUtils } from "src/utils/ResponseUtils";
import { CaseResult } from "../../test/model/caseresult";
import { CaseSendRequest } from "../model/casesendrequest";
import { CommonResponse } from "../model/response";
import { CaseHandleFactoryService } from "./casehandlefactory.service";

@Injectable()
export class CaseSendService {

    @Inject()
    private readonly testService: TestService;

    @Inject()
    private readonly caseHandleFactoryService: CaseHandleFactoryService;

    async caseSend(caseSendRequest: CaseSendRequest): Promise<CommonResponse> {
        const caseTestResult = new CaseResult("root", [], []);

        if (caseSendRequest.preRequestScript !== undefined) {
            try {
                let preScriptResult = await this.testService.runTestScript({ code: caseSendRequest.preRequestScript, response: caseSendRequest.body.body });
                caseTestResult.children.push(...preScriptResult.children);
            } catch (error) {
                return new Promise((resolve, reject) => {
                    resolve(ResponseUtils.exceptionResponse(JSON.stringify(error)));
                });
            }
        }

        // 预处理request, url, header


        // 发送请求
        let caseHandleService = this.caseHandleFactoryService.select(caseSendRequest);
        let sendTasks = caseHandleService.buildSendTasks(caseSendRequest);

        let observables = forkJoin([...sendTasks]);
        const res = await new Promise<Array<any>>(
            (resolve) => {
                observables.subscribe(item => {
                    resolve(item)
                })
            }
        );

        let caseSendResponse = await caseHandleService.processSendResponse(res, caseSendRequest.testScript, caseTestResult);

        caseHandleService.backFillRelatedInfo(caseSendResponse, caseSendRequest);
        return Promise.resolve(ResponseUtils.successResponse(caseSendResponse));
    }

}

