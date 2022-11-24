import { ResponseStatusType } from './responsestatustype';

export interface CommonResponse {
  getResponseStatusType(): ResponseStatusType;

  setResponseStatusType(responseStatusType: ResponseStatusType): void;
}
