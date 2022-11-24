import { Injectable } from "@nestjs/common";
import { RunEnv } from "../../test/model/runenv";
import { CaseRequest } from "../model/caserequest";

@Injectable()
export class ProprecessService {

    preprocess(caseRequest: CaseRequest, envList: Array<RunEnv>) {
        if (!envList || envList.length === 0) {
            return;
        }

        if (caseRequest.baseAddress) {
            caseRequest.baseAddress.endpoint = this.urlPretreatment(caseRequest.baseAddress.endpoint, envList,
                (runEnv: RunEnv) => runEnv.value);
            caseRequest.testAddress.endpoint = this.urlPretreatment(caseRequest.testAddress.endpoint, envList,
                (runEnv: RunEnv) => runEnv.value);
        } else {
            caseRequest.address.endpoint = this.urlPretreatment(caseRequest.address.endpoint, envList,
                (runEnv: RunEnv) => runEnv.value);
        }

        caseRequest.body = this.urlPretreatment(caseRequest.body, envList,
            (runEnv: RunEnv) => runEnv.value);

        for (let index = 0; index < caseRequest.headers.length; index++) {
            let keyvaluepair = caseRequest.headers[index];
            keyvaluepair.value = this.urlPretreatment(keyvaluepair.value, envList,
                (runEnv: RunEnv) => runEnv.value);
        }
    }

    private urlPretreatment(url: string, envList: Array<RunEnv>, callback): string {
        const editorValueMatch = url.match(/(?<=\{\{)(.*?)(?=\}\})/g) || [];
        if (editorValueMatch.length === 0) {
            return url;
        }
        let pickedEnvList = this.selectEnvList(editorValueMatch, envList);
        for (let index = 0; index < pickedEnvList.length; index++) {
            const element = pickedEnvList[index];
            url = url.replace("{{" + element.key + "}}", callback(element));
        }
        return url;
    }

    private selectEnvList(editorValueMatch: RegExpMatchArray, envList: Array<RunEnv>): Array<RunEnv> {
        let res = new Array<RunEnv>;
        for (let index = 0; index < editorValueMatch.length; index++) {
            const element = editorValueMatch[index];
            for (let envIndex = 0; envIndex < envList.length; envIndex++) {
                const runEnv = envList[envIndex];
                if (element === runEnv.key) {
                    res.push(runEnv);
                }
            }
        }
        return res;
    }
}