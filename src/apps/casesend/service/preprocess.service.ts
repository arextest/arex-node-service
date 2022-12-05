import { Injectable } from '@nestjs/common';
import { RunVar } from '../../test/model/runvar';
import { RunEnv } from '../../test/model/runenv';
import { CaseRequest } from '../model/caserequest';

@Injectable()
export class ProprecessService {
  preprocess(
    caseRequest: CaseRequest,
    envList: Array<RunEnv>,
    varList: Array<RunVar>,
  ) {
    if (
      (!envList || envList.length === 0) &&
      (!varList || varList.length === 0)
    ) {
      return;
    }

    // 兼容Array<RunEnv>和Array<RunVar>
    const envAndVar = this.unitEnvAndVar(envList, varList);

    if (caseRequest.baseAddress) {
      caseRequest.baseAddress.endpoint = this.urlPretreatment(
        caseRequest.baseAddress.endpoint,
        envAndVar,
        (item) => item.value,
      );
      caseRequest.testAddress.endpoint = this.urlPretreatment(
        caseRequest.testAddress.endpoint,
        envAndVar,
        (item) => item.value,
      );
    } else {
      caseRequest.address.endpoint = this.urlPretreatment(
        caseRequest.address.endpoint,
        envAndVar,
        (item) => item.value,
      );
    }

    caseRequest.body = this.urlPretreatment(
      caseRequest.body,
      envAndVar,
      (item) => item.value,
    );

    for (let index = 0; index < caseRequest.headers.length; index++) {
      const keyvaluepair = caseRequest.headers[index];
      keyvaluepair.value = this.urlPretreatment(
        keyvaluepair.value,
        envAndVar,
        (item) => item.value,
      );
    }
  }

  urlPretreatment(
    url: string,
    resMap: Map<string, { key: string; value: string }>,
    callback,
  ): string {
    const editorValueMatch = url?.match(/(?<=\{\{)(.*?)(?=\}\})/g) || [];
    if (editorValueMatch.length === 0) {
      return url;
    }

    for (let index = 0; index < editorValueMatch.length; index++) {
      const element = editorValueMatch[index];
      if (resMap.has(element)) {
        const temp = resMap.get(element);
        url = url.replace('{{' + element + '}}', callback(temp));
      }
    }
    return url;
  }

  private unitEnvAndVar(envList: Array<RunEnv>, varList: Array<RunVar>) {
    const res = new Map<string, { key: string; value: string }>();
    if (envList) {
      for (let index = 0; index < envList.length; index++) {
        const element = envList[index];
        res.set(element.key, { key: element.key, value: element.value });
      }
    }
    if (varList) {
      for (let index = 0; index < varList.length; index++) {
        const element = varList[index];
        res.set(element.key, {
          key: element.key,
          value:
            typeof element.value === 'string'
              ? element.value
              : JSON.stringify(element.value),
        });
      }
    }
    return res;
  }
}
