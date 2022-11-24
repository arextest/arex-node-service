import { Inject, Injectable } from "@nestjs/common";
import { CaseRequest } from "../../../../src/apps/casesend/model/caserequest";
import { ExecScriptResult } from "../model/execscriptresult";
import { MapEnv } from "../model/mapenv";
import { PreTestScriptResponse } from "../model/pretestscriptresponse";
import { RunEnv } from "../model/runenv";
import { TestService } from "./test.service";

@Injectable()
export class PreTestService {

    @Inject()
    private readonly testService: TestService;


    runPreTestScript(caserequest: CaseRequest, envList: Array<RunEnv>, preTestScripts: Array<string>): Promise<PreTestScriptResponse> {

        return new Promise(async (resolve, reject) => {
            let multiScriptresult = new ExecScriptResult();
            let envMap = this.runEnvList2EnvMap(envList);

            for (let index = 0; index < preTestScripts.length; index++) {
                const element = preTestScripts[index];
                try {
                    let execScriptResult = await this.testService.runTestScript(element, { request: caserequest, environment: envMap });
                    multiScriptresult.caseResult.children.push(...execScriptResult.caseResult.children);
                } catch (error) {
                    reject(error);
                    return;
                }
            }
            multiScriptresult.environment = envMap;
            resolve(this.buildPreTestScriptResponse(caserequest, multiScriptresult));
        })
    }

    private runEnvList2EnvMap(envList: Array<RunEnv>): MapEnv {
        let mapEnv = new MapEnv();
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
        let temp = mapEnv?.envContainer;
        if (temp === null || temp === undefined) {
            return new Array<RunEnv>;
        } else {
            return Array.from(temp.values());
        }
    }

    private buildPreTestScriptResponse(caserequest: CaseRequest, multiScriptresult: ExecScriptResult): PreTestScriptResponse {
        let pretestscriptresponse = new PreTestScriptResponse();
        pretestscriptresponse.address = caserequest.address;
        pretestscriptresponse.headers = caserequest.headers;
        pretestscriptresponse.body = pretestscriptresponse.body;
        pretestscriptresponse.baseAddress = caserequest.baseAddress;
        pretestscriptresponse.testAddress = caserequest.testAddress;
        pretestscriptresponse.envList = this.envMap2RunEnvList(multiScriptresult.environment);
        pretestscriptresponse.caseResult = multiScriptresult.caseResult;
        return pretestscriptresponse;
    }

}
