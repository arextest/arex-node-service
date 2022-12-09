import { Body, Controller, Inject, Post } from '@nestjs/common';
import { CaseRequest } from '../../casesend/model/caserequest';
import { ResponseUtils } from '../../utils/responseutils';
import { PreTestScriptRequest } from '../model/pretestscriptrequest';
import { PreTestService } from '../service/pretest.service';
import { TestService } from '../service/test.service';

@Controller()
export class TestController {
  @Inject()
  private readonly testService: TestService;

  @Inject()
  private readonly preTestService: PreTestService;

  @Post('/preTest')
  async runPreTestScript(@Body() preTestScriptRequest: PreTestScriptRequest) {
    if (
      preTestScriptRequest.preTestScripts === undefined ||
      preTestScriptRequest.preTestScripts === null ||
      preTestScriptRequest.preTestScripts.length === 0
    ) {
      return ResponseUtils.exceptionResponse('preTest');
    }

    const caseRequest = this.buildRequest(preTestScriptRequest);
    try {
      const PreTestScriptResponse = await this.preTestService.runPreTestScript(
        caseRequest,
        preTestScriptRequest.envList,
        preTestScriptRequest.varList,
        preTestScriptRequest.preTestScripts,
        preTestScriptRequest.response
          ? JSON.parse(preTestScriptRequest.response)
          : preTestScriptRequest.response,
      );
      return ResponseUtils.successResponse(PreTestScriptResponse);
    } catch (error) {
      return ResponseUtils.exceptionResponse(error.message);
    }
  }

  private buildRequest(
    preTestScriptRequest: PreTestScriptRequest,
  ): CaseRequest {
    const caserequest = new CaseRequest();
    caserequest.address = preTestScriptRequest.address;
    caserequest.headers = preTestScriptRequest.headers;
    caserequest.params = preTestScriptRequest.params;
    caserequest.body = preTestScriptRequest.body;
    caserequest.baseAddress = preTestScriptRequest.baseAddress;
    caserequest.testAddress = preTestScriptRequest.testAddress;
    return caserequest;
  }
}
