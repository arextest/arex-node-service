import { CaseResult } from './caseresult';
import { MapEnv } from './mapenv';
import { MapVar } from './mapvar';

export class ExecScriptResult {
  caseResult: CaseResult = new CaseResult('root', [], []);
  environment: MapEnv = new MapEnv();
  variables: MapVar = new MapVar();
}
