import { Injectable } from '@nestjs/common';
import { RunEnv } from '../../test/model/runenv';
import { RunVar } from '../../test/model/runvar';
import { CaseRequest } from '../model/caserequest';
import { KeyValuePairType } from '../model/keyvaluepairType';

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

    const envAndVar = this.unitEnvAndVar(envList, varList);
    if (caseRequest.params) {
      for (let index = 0; index < caseRequest.params.length; index++) {
        const param = caseRequest.params[index];
        param.key = this.urlPretreatment(
          param.key,
          envAndVar,
          (item) => item.value,
        );
        param.value = this.urlPretreatment(
          param.value,
          envAndVar,
          (item) => item.value,
        );
      }
    }

    const queryString = this.mergeParams(caseRequest.params);

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

      caseRequest.baseAddress.endpoint =
        caseRequest.baseAddress.endpoint + queryString;
      caseRequest.testAddress.endpoint =
        caseRequest.testAddress.endpoint + queryString;
    } else {
      caseRequest.address.endpoint = this.urlPretreatment(
        caseRequest.address.endpoint,
        envAndVar,
        (item) => item.value,
      );

      caseRequest.address.endpoint = caseRequest.address.endpoint + queryString;
    }

    caseRequest.body = this.urlPretreatment(
      caseRequest.body,
      envAndVar,
      (item) => item.value,
    );

    if (caseRequest.headers) {
      for (let index = 0; index < caseRequest.headers.length; index++) {
        const keyvaluepair = caseRequest.headers[index];
        keyvaluepair.key = this.urlPretreatment(
          keyvaluepair.key,
          envAndVar,
          (item) => item.value,
        );
        keyvaluepair.value = this.urlPretreatment(
          keyvaluepair.value,
          envAndVar,
          (item) => item.value,
        );
      }
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

  private mergeParams(params: Array<KeyValuePairType>) {
    if (!params || params.length === 0) {
      return '';
    }

    const queryString = [];
    for (let index = 0; index < params.length; index++) {
      const element = params[index];
      if (!element || (!element.key && !element.value)) {
        continue;
      }
      queryString.push(
        (element.key ? element.key : '') +
          '=' +
          (element.value ? element.value : ''),
      );
    }

    return queryString.length === 0 ? '' : '?' + queryString.join('&');
  }
}
