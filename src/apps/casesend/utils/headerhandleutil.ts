import { KeyValuePairType } from '../model/keyvaluepairType';

export class HeaderHandleUtil {
  static transformHeader(headers): Array<KeyValuePairType> {
    if (!headers) {
      return undefined;
    }
    const result = new Array<KeyValuePairType>();
    Object.keys(headers).forEach((key) => {
      result.push({ key: key, value: headers[key] });
    });
    return result;
  }
}
