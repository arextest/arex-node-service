import { Body, Controller, Inject, Post } from '@nestjs/common';
import { CaseRequest } from '../../casesend/model/caserequest';
import { ResponseUtils } from '../../utils/responseutils';
import { PreTestScriptRequest } from '../model/pretestscriptrequest';
import { PreTestService } from '../service/pretest.service';
import { TestService } from '../service/test.service';
const JSONBig = require('json-bigint');
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
      const preTestScriptResponse = await this.preTestService.runPreTestScript(
        caseRequest,
        preTestScriptRequest.envList,
        preTestScriptRequest.varList,
        preTestScriptRequest.preTestScripts,
        this.buildRespponse(preTestScriptRequest.response),
      );
      return ResponseUtils.successResponse(preTestScriptResponse);
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
    caserequest.body = preTestScriptRequest.body
      ? JSONBig.parse(preTestScriptRequest.body)
      : undefined;
    caserequest.originBody = preTestScriptRequest.body;
    caserequest.baseAddress = preTestScriptRequest.baseAddress;
    caserequest.testAddress = preTestScriptRequest.testAddress;
    return caserequest;
  }

  private buildRespponse(response) {
    if (!response) {
      return response;
    }
    const res = JSONBig.parse(response);
    if (res && res.body) {
      res.originBody = JSONBig.stringify(res.body);
    }
    return res;
  }
}
