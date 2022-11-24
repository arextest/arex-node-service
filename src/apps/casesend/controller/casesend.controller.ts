import {
    Body,
    Controller, Inject, Post
} from "@nestjs/common";
import { ResponseUtils } from "src/apps/utils/responseutils";
import { CaseSendService } from "../../casesend/service/casesend.service";
import { CaseSendRequest } from "../model/casesendrequest";
import { CaseSendResponse } from "../model/casesendresponse";
import { CaseStatus } from "../model/casestatus";

@Controller()
export class CaseSendController {


    @Inject()
    private readonly caseSendService: CaseSendService


    @Post("/casesend")
    async caseSend(@Body() caseSendRequest: CaseSendRequest) {

        try {
            let caseSendResponse = await this.caseSendService.caseSend(caseSendRequest);
            return ResponseUtils.successResponse(caseSendResponse);
        } catch (error) {
            let caseSendResponse = new CaseSendResponse();
            caseSendResponse.caseStatus = CaseStatus.EXCEPTION;
            caseSendResponse.exceptionMsg = error.message;
            return ResponseUtils.successResponse(caseSendResponse);
        }
    }

}