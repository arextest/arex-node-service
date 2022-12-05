import { Body, Controller, Inject, OnModuleInit, Post } from '@nestjs/common';
import { ResponseUtils } from '../../utils/responseutils';
import { CaseSendService } from '../../casesend/service/casesend.service';
import { CaseSendRequest } from '../model/casesendrequest';
import { CaseSendResponse } from '../model/casesendresponse';
import { CaseStatus } from '../model/casestatus';
@Controller()
export class CaseSendController implements OnModuleInit {
  onModuleInit() {
    global.CaseSendControllerInstence = this;
  }
  @Inject()
  private readonly caseSendService: CaseSendService;

  @Post('/casesend')
  async caseSend(@Body() caseSendRequest: CaseSendRequest) {
    try {
      const caseSendResponse = await this.caseSendService.caseSend(
        caseSendRequest,
      );
      return ResponseUtils.successResponse(caseSendResponse);
    } catch (error) {
      const caseSendResponse = new CaseSendResponse();
      caseSendResponse.caseStatus = CaseStatus.EXCEPTION;
      caseSendResponse.exceptionMsg = error.message;
      return ResponseUtils.successResponse(caseSendResponse);
    }
  }
}
