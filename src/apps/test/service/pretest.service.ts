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


    async runPreTestScript(caserequest: CaseRequest, envList: Array<RunEnv>, preTestScripts: Array<string>): Promise<PreTestScriptResponse> {
        let envMap = this.runEnvList2EnvMap(envList);
        let multiScriptresult = new ExecScriptResult();
        for (let index = 0; index < preTestScripts.length; index++) {
            const element = preTestScripts[index];
            let execScriptResult = undefined;
            try {
                execScriptResult = await this.testService.runTestScript(element, { request: caserequest, environment: envMap });
            } catch (error) {
                throw error;
            }
            multiScriptresult.caseResult.children.push(...execScriptResult.caseResult.children);
        }
        // process.on("uncaughtException", function (err, origin) {
        //     console.log(origin)
        //     console.log(err);
        // });
        multiScriptresult.environment = envMap;
        return this.buildPreTestScriptResponse(caserequest, multiScriptresult);
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

    private buildPreTestScriptResponse(caserequest: CaseRequest, multiScriptresult: ExecScriptResult): Promise<PreTestScriptResponse> {
        let pretestscriptresponse = new PreTestScriptResponse();
        pretestscriptresponse.address = caserequest.address;
        pretestscriptresponse.headers = caserequest.headers;
        pretestscriptresponse.body = pretestscriptresponse.body;
        pretestscriptresponse.baseAddress = caserequest.baseAddress;
        pretestscriptresponse.testAddress = caserequest.testAddress;
        pretestscriptresponse.envList = this.envMap2RunEnvList(multiScriptresult.environment);
        pretestscriptresponse.caseResult = multiScriptresult.caseResult;
        return Promise.resolve(pretestscriptresponse);
    }

}
