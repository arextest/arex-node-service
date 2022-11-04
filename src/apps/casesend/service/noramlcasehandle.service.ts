import { Inject, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { TestService } from "../../test/test.service";
import { CaseResult } from "../../test/model/caseresult";
import { CaseSendRequest } from "../model/casesendrequest";
import { CaseSendResponse } from "../model/casesendresponse";
import { CaseStatus } from "../model/casestatus";
import { CaseHandleService } from "./casehandle.service";
import { BuildSendTaskSerive } from "./buildSendTask.servce";

@Injectable()
export class NoramlCaseHandleService extends CaseHandleService {

    @Inject()
    private readonly buildSendTaskSerive: BuildSendTaskSerive;

    @Inject()
    private readonly testService: TestService;

    public isSupport(caseSendRequest: CaseSendRequest): boolean {
        return caseSendRequest.baseAddress === undefined;
    }

    public buildSendTasks(caseSendRequest: CaseSendRequest): Observable<any>[] {
        let sendTasks = [];
        sendTasks.push(this.buildSendTaskSerive.sendRequest(caseSendRequest.headers, caseSendRequest.body, caseSendRequest.address));
        return sendTasks;
    }

    public async processSendResponse(res: Array<any>, testScript: string, caseTestResult: CaseResult): Promise<CaseSendResponse> {
        let response = res[0];
        let caseSendResponse = new CaseSendResponse();
        if (typeof response === "string") {
            caseSendResponse.caseStatus = CaseStatus.EXCEPTION;
            caseSendResponse.exceptionMsg = response;
            return Promise.resolve(caseSendResponse);
        } else {
            caseSendResponse.response = response.body;
            let testResult = await this.testService.runTestScript({ code: testScript, response: response });
            caseTestResult.children.push(...testResult.children);
            caseSendResponse.testResult = JSON.stringify(caseTestResult);
            caseSendResponse.caseStatus = this.judgeCaseStatus(caseTestResult);
            return Promise.resolve(caseSendResponse);
        }
    }

    public backFillRelatedInfo(caseSendResponse: CaseSendResponse, caseSendRequest: CaseSendRequest) {
        caseSendResponse.url = caseSendRequest.address.url;
        caseSendResponse.headers = caseSendRequest.headers;
        caseSendResponse.request = caseSendRequest.body.body;
    }


}