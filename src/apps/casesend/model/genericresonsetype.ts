import { ResponseStatusType } from './responsestatustype';
import { CommonResponse } from './response';

export class GenericResponseType<T> implements CommonResponse {
  responseStatusType: ResponseStatusType;
  body: T;

  constructor(responseStatusType: ResponseStatusType, body: T) {
    this.responseStatusType = responseStatusType;
    this.body = body;
  }

  getResponseStatusType(): ResponseStatusType {
    return this.responseStatusType;
  }

  setResponseStatusType(responseStatusType: ResponseStatusType): void {
    this.responseStatusType = responseStatusType;
  }
}
