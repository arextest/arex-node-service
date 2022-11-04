import { Inject, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { CaseResult } from "../../test/model/caseresult";
import { TestService } from "../../test/test.service";
import { CaseSendRequest } from "../model/casesendrequest";
import { CaseSendResponse } from "../model/casesendresponse";
import { CaseStatus } from "../model/casestatus";
import { BuildSendTaskSerive } from "./buildsendtask.servce";
import { CaseHandleService } from "./casehandle.service";

@Injectable()
export class DoubleCaseHandleService extends CaseHandleService {

    @Inject()
    private readonly buildSendTaskSerive: BuildSendTaskSerive;

    @Inject()
    private readonly testService: TestService;

    isSupport(caseSendRequest: CaseSendRequest): boolean {
        return caseSendRequest.baseAddress !== undefined;
    }


    public buildSendTasks(caseSendRequest: CaseSendRequest): Observable<any>[] {
        let sendTasks = [];
        sendTasks.push(this.buildSendTaskSerive.sendRequest(caseSendRequest.headers, caseSendRequest.body, caseSendRequest.baseAddress));
        sendTasks.push(this.buildSendTaskSerive.sendRequest(caseSendRequest.headers, caseSendRequest.body, caseSendRequest.testAddress));
        return sendTasks;
    }

    public async processSendResponse(res: Array<any>, testScript: string, caseTestResult: CaseResult): Promise<CaseSendResponse> {
        let baseResponse = res[0];
        let testResponse = res[1];
        let caseSendResponse = new CaseSendResponse();
        if (typeof baseResponse === "string" || typeof testResponse === "string") {
            caseSendResponse.caseStatus = CaseStatus.EXCEPTION;
            caseSendResponse.exceptionMsg = typeof baseResponse === "string" ? baseResponse : testResponse;
            return Promise.resolve(caseSendResponse);
        } else {
            caseSendResponse.baseResponse = baseResponse.body;
            caseSendResponse.testResponse = testResponse.body;

            let baseTestResult = await this.testService.runTestScript({ code: testScript, response: baseResponse });
            let testTestResult = await this.testService.runTestScript({ code: testScript, response: testResponse });

            baseTestResult.children.push(...caseTestResult.children);

            caseSendResponse.baseTestResult = JSON.stringify(baseTestResult);
            caseSendResponse.testTestResult = JSON.stringify(testTestResult);
            caseSendResponse.caseStatus = this.judgeCaseStatus(baseTestResult) && this.judgeCaseStatus(testTestResult);
            return Promise.resolve(caseSendResponse);
        }
    }

    public backFillRelatedInfo(caseSendResponse: CaseSendResponse, caseSendRequest: CaseSendRequest) {
        caseSendResponse.baseUrl = caseSendRequest.baseAddress.url;
        caseSendResponse.testUrl = caseSendRequest.testAddress.url;

        caseSendResponse.headers = caseSendRequest.headers;
        caseSendResponse.request = caseSendRequest.body.body;
    }


}