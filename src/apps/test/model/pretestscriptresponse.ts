import { Address } from "src/apps/casesend/model/address";
import { KeyValuePairType } from "src/apps/casesend/model/keyvaluepairType";
import { CaseResult } from "./caseresult";
import { RunEnv } from "./runenv";

export class PreTestScriptResponse {
    address: Address;
    headers: Array<KeyValuePairType>;
    body: string;
    envList: Array<RunEnv>;

    baseAddress: Address;
    testAddress: Address;

    caseResult: CaseResult;

}