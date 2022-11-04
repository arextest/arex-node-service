import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from "@nestjs/common";
import { AxiosRequestHeaders } from 'axios';
import { catchError, map, Observable, of, timeout } from "rxjs";
import { Address } from "../model/address";
import { BodyType } from "../model/bodytype";
import { KeyValuePairType } from "../model/keyvaluepairType";

@Injectable()
export class BuildSendTaskSerive {

    @Inject()
    private readonly httpService: HttpService;

    public sendRequest(headerArray: Array<KeyValuePairType>, body: BodyType, address: Address): Observable<any> {
        let res:Observable<any> = undefined;
        switch (address.method) {
            case 'GET':
                res =  this.sendGetRequest(headerArray, body, address);
                break;
            case 'POST':
                res = this.sendPostRequest(headerArray, body, address);
                break;
            default:
                return of("the method not support");
        }
        return res;
    }

    public sendGetRequest(headerArray: Array<KeyValuePairType>, body: BodyType, address: Address): Observable<any> {
        let customHeader = this.getHeaders(headerArray, body);
        return this.httpService.get(address.url, { headers: customHeader }).pipe(
            map(res => {
                return { "status": res.status, "statusText": res.statusText, "headers": res.headers, "body": res.data };
            }),
            timeout(5000),
            catchError(error => of(JSON.stringify(error)))
        )
    }

    public sendPostRequest(headerArray: Array<KeyValuePairType>, body: BodyType, address: Address): Observable<any> {
        let customHeader = this.getHeaders(headerArray, body)
        return this.httpService.post(address.url, body.body, { headers: customHeader }).pipe(
            map(res => {
                return { "status": res.status, "statusText": res.statusText, "headers": res.headers, "body": res.data };
            }),
            timeout(5000),
            catchError(error => of(JSON.stringify(error)))
        )
    }

    public getHeaders(headerArray: Array<KeyValuePairType>, body: BodyType): AxiosRequestHeaders {
        let headers: AxiosRequestHeaders = {};
        headerArray?.forEach(({ key, value }) => {
            headers[key] = value;
        });
        headers["Content-Type"] = body.contenttype;
        return headers;
    }
}