import { Inject, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { CaseResult } from "../../test/model/caseresult";
import { TestService } from "../../test/service/test.service";
import { CaseRequest } from "../model/caserequest";
import { CaseSendResponse } from "../model/casesendresponse";
import { CaseStatus } from "../model/casestatus";
import { BuildSendTaskSerive } from "./buildsendtask.servce";
import { CaseHandleService } from "./casehandle.service";

@Injectable()
export class NoramlCaseHandleService extends CaseHandleService {

    @Inject()
    private readonly buildSendTaskSerive: BuildSendTaskSerive;

    @Inject()
    private readonly testService: TestService;

    public isSupport(caseRequest: CaseRequest): boolean {
        return caseRequest.baseAddress === undefined;
    }

    public buildSendTasks(caseRequest: CaseRequest): Observable<any>[] {
        let sendTasks = [];
        sendTasks.push(this.buildSendTaskSerive.sendRequest(caseRequest.headers, caseRequest.body, caseRequest.address));
        return sendTasks;
    }

    public async processSendResponse(res: Array<any>, req: CaseRequest, testScript: string, caseTestResult: CaseResult): Promise<CaseSendResponse> {
        let response = res[0];
        let caseSendResponse = new CaseSendResponse();
        if (typeof response === "string") {
            caseSendResponse.caseStatus = CaseStatus.EXCEPTION;
            caseSendResponse.exceptionMsg = response;
            return Promise.resolve(caseSendResponse);
        } else {
            caseSendResponse.response = response.body;
            let testResult = await this.testService.runTestScript(testScript, { request: req, response: response });
            testResult.caseResult.children.push(...caseTestResult.children);
            caseSendResponse.testResult = JSON.stringify(testResult.caseResult);
            caseSendResponse.caseStatus = this.judgeCaseStatus(testResult.caseResult);
            return Promise.resolve(caseSendResponse);
        }
    }

    public backFillRelatedInfo(caseSendResponse: CaseSendResponse, caseRequest: CaseRequest) {
        caseSendResponse.url = caseRequest.address.endpoint;
        caseSendResponse.headers = caseRequest.headers;
        caseSendResponse.request = caseRequest.body;
    }


}