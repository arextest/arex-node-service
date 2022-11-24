import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { AxiosRequestHeaders } from 'axios';
import { catchError, map, Observable, of, timeout } from 'rxjs';
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
  ): Observable<any> {
    let res: Observable<any> = undefined;
    switch (address.method) {
      case 'GET':
        res = this.sendGetRequest(headers, body, address);
        break;
      case 'POST':
        res = this.sendPostRequest(headers, body, address);
        break;
      default:
        return of('the method not support');
    }
    return res;
  }

  public sendGetRequest(
    headers: Array<KeyValuePairType>,
    body: string,
    address: Address,
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
        timeout(5000),
        catchError((error) => of(JSON.stringify(error))),
      );
  }

  public sendPostRequest(
    headers: Array<KeyValuePairType>,
    body: string,
    address: Address,
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
        timeout(5000),
        catchError((error) => of(JSON.stringify(error))),
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
