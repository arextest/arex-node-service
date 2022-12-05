import { Inject, Injectable } from '@nestjs/common';
import { CaseRequest } from '../../casesend/model/caserequest';
import { ExecScriptResult } from '../model/execscriptresult';
import { MapEnv } from '../model/mapenv';
import { MapVar } from '../model/mapvar';
import { PreTestScriptResponse } from '../model/pretestscriptresponse';
import { RunEnv } from '../model/runenv';
import { RunVar } from '../model/runvar';
import { TestService } from './test.service';

@Injectable()
export class PreTestService {
  @Inject()
  private readonly testService: TestService;

  runPreTestScript(
    caserequest: CaseRequest,
    envList: Array<RunEnv>,
    varList: Array<RunVar>,
    preTestScripts: Array<string>,
    response?: string,
  ): Promise<PreTestScriptResponse> {
    return new Promise(async (resolve, reject) => {
      const multiScriptresult = new ExecScriptResult();
      const envMap = this.runEnvList2EnvMap(envList);
      const varMap = this.runVarList2VarMap(varList);
      const code = preTestScripts.join(';');
      try {
        const execScriptResult = await this.testService.runTestScript(code, {
          request: caserequest,
          response: response,
          environment: envMap,
          variables: varMap,
        });
        multiScriptresult.caseResult.children.push(
          ...execScriptResult.caseResult.children,
        );
      } catch (error) {
        reject(error);
        return;
      }

      multiScriptresult.environment = envMap;
      multiScriptresult.variables = varMap;
      resolve(this.buildPreTestScriptResponse(caserequest, multiScriptresult));
    });
  }

  private runEnvList2EnvMap(envList: Array<RunEnv>): MapEnv {
    const mapEnv = new MapEnv();
    if (envList === null || envList === undefined) {
      return mapEnv;
    }
    for (let index = 0; index < envList.length; index++) {
      const element = envList[index];
      mapEnv.set(element.key, element.value);
    }
    return mapEnv;
  }

  private envMap2RunEnvList(mapEnv: MapEnv): Array<RunEnv> {
    const temp = mapEnv?.envContainer;
    if (temp === null || temp === undefined) {
      return new Array<RunEnv>();
    } else {
      return Array.from(temp.values());
    }
  }

  private runVarList2VarMap(varList: Array<RunVar>): MapVar {
    const mapVar = new MapVar();
    if (varList === null || varList === undefined) {
      return mapVar;
    }
    for (let index = 0; index < varList.length; index++) {
      const element = varList[index];
      mapVar.set(element.key, element.value);
    }
    return mapVar;
  }

  private varMap2RunVarList(mapVar: MapVar): Array<RunVar> {
    const temp = mapVar?.varContainer;
    if (temp === null || temp === undefined) {
      return new Array<RunVar>();
    } else {
      return Array.from(temp.values());
    }
  }

  private buildPreTestScriptResponse(
    caserequest: CaseRequest,
    multiScriptresult: ExecScriptResult,
  ): PreTestScriptResponse {
    const pretestscriptresponse = new PreTestScriptResponse();
    pretestscriptresponse.address = caserequest.address;
    pretestscriptresponse.headers = caserequest.headers;
    pretestscriptresponse.body = pretestscriptresponse.body;
    pretestscriptresponse.baseAddress = caserequest.baseAddress;
    pretestscriptresponse.testAddress = caserequest.testAddress;
    pretestscriptresponse.envList = this.envMap2RunEnvList(
      multiScriptresult.environment,
    );
    pretestscriptresponse.varList = this.varMap2RunVarList(
      multiScriptresult.variables,
    );
    pretestscriptresponse.caseResult = multiScriptresult.caseResult;
    return pretestscriptresponse;
  }
}
