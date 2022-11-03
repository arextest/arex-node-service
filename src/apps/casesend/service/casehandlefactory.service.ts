import { Inject, Injectable } from "@nestjs/common";
import { CaseSendRequest } from "../model/casesendrequest";
import { CaseHandleService } from "./casehandle.service";
import { DoubleCaseHandleService } from "./doublecasehandle.service";
import { NoramlCaseHandleService } from "./noramlcasehandle.service";

@Injectable()
export class CaseHandleFactoryService {

    @Inject()
    noramlCaseHandleService: NoramlCaseHandleService;

    @Inject()
    doubleCaseHandleService: DoubleCaseHandleService;

    public select(caseSendRequest: CaseSendRequest): CaseHandleService {
        if (caseSendRequest.baseAddress === undefined) {
            return this.noramlCaseHandleService;
        }
        return this.doubleCaseHandleService;
    }

}