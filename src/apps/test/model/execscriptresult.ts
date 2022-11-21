import { CaseResult } from "./caseresult";
import { MapEnv } from "./mapenv";

export class ExecScriptResult {
    caseResult: CaseResult = new CaseResult('root', [], []);
    environment: MapEnv = new MapEnv();
}