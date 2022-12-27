import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { AxiosRequestHeaders } from 'axios';
import { map, Observable, throwError, timeout } from 'rxjs';
import { Address } from '../model/address';
import { KeyValuePairType } from '../model/keyvaluepairType';

@Injectable()
export class BuildSendTaskSerive {
  @Inject()
  private readonly httpService: HttpService;

  public sendRequest(
    headers: Array<KeyValuePairType>,
    body: string,
    address: Address,
    sendTimeout: number,
  ): Observable<any> {
    let res: Observable<any> = undefined;
    switch (address.method) {
      case 'GET':
        res = this.sendGetRequest(headers, body, address, sendTimeout);
        break;
      case 'POST':
        res = this.sendPostRequest(headers, body, address, sendTimeout);
        break;
      default:
        return throwError(() => new Error('the request method not support'));
    }
    return res;
  }

  public sendGetRequest(
    headers: Array<KeyValuePairType>,
    body: string,
    address: Address,
    sendTimeout: number,
  ): Observable<any> {
    const customHeader = this.getHeaders(headers);
    return this.httpService
      .get(address.endpoint, { headers: customHeader })
      .pipe(
        map((res) => {
          return {
            status: res.status,
            statusText: res.statusText,
            headers: res.headers,
            body: res.data,
          };
        }),
        timeout(sendTimeout),
      );
  }

  public sendPostRequest(
    headers: Array<KeyValuePairType>,
    body: string,
    address: Address,
    sendTimeout: number,
  ): Observable<any> {
    const customHeader = this.getHeaders(headers);
    return this.httpService
      .post(address.endpoint, body, { headers: customHeader })
      .pipe(
        map((res) => {
          return {
            status: res.status,
            statusText: res.statusText,
            headers: res.headers,
            body: res.data,
          };
        }),
        timeout(sendTimeout),
      );
  }

  public getHeaders(headerArray: Array<KeyValuePairType>): AxiosRequestHeaders {
    const headers: AxiosRequestHeaders = {};
    headerArray?.forEach(({ key, value }) => {
      headers[key] = value;
    });
    return headers;
  }
}
