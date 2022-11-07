import { Observable } from "rxjs";
import { CaseResult } from "../../test/model/caseresult";
import { CaseSendRequest } from "../model/casesendrequest";
import { CaseSendResponse } from "../model/casesendresponse";
import { CaseStatus } from "../model/casestatus";

export abstract class CaseHandleService {

    abstract isSupport(caseSendRequest: CaseSendRequest): boolean;

    abstract buildSendTasks(caseSendRequest: CaseSendRequest): Array<Observable<any>>;

    abstract processSendResponse(res: Array<any>, testScript: string, caseTestResult: CaseResult): Promise<CaseSendResponse>;

    abstract backFillRelatedInfo(caseSendResponse: CaseSendResponse, caseSendRequest: CaseSendRequest)

    judgeCaseStatus(caseResult: CaseResult): Number {
        let caseStatus = CaseStatus.NO_PROBLEM;
        let childrenArray = caseResult.children;
        for (let i = 0; i < childrenArray.length; i++) {
            let children = childrenArray[i];
            let expectResult = children.expectResults;
            for (let j = 0; j < expectResult.length; j++) {
                let element = expectResult[j];
                if (element.status === "fail") {
                    caseStatus = CaseStatus.HAVE_PROBLEM;
                    break;
                }
            }
        }
        return caseStatus;
    }

}