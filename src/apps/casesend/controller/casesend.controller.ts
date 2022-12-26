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
      this.checkReqParams(caseSendRequest);

      const caseSendResponse = await this.promiseTimeout(
        this.caseSendService.caseSend(caseSendRequest),
        caseSendRequest.interfaceTimeout,
      );
      return ResponseUtils.successResponse(caseSendResponse);
    } catch (error) {
      const caseSendResponse = new CaseSendResponse();
      caseSendResponse.caseStatus = CaseStatus.EXCEPTION;
      caseSendResponse.exceptionMsg = error.message;
      return ResponseUtils.successResponse(caseSendResponse);
    }
  }

  private checkReqParams(caseSendRequest: CaseSendRequest) {
    if (!caseSendRequest.interfaceTimeout) {
      caseSendRequest.interfaceTimeout = 3 * 60 * 1000;
    }
    if (!caseSendRequest.sendTimeout) {
      caseSendRequest.sendTimeout = 90 * 1000;
    }
  }

  private promiseTimeout(promise, delay) {
    const timeout = new Promise(function (reslove, reject) {
      setTimeout(function () {
        reject(new Error('time out because of inerfaceTimeout'));
      }, delay);
    });
    return Promise.race([timeout, promise]);
  }
}
