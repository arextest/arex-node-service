export class ResponseStatusType {
  responseCode: number;
  responseDesc: string;
  timestamp: number;

  constructor(responseCode: number, responseDesc: string, timestamp: number) {
    this.responseCode = responseCode;
    this.responseDesc = responseDesc;
    this.timestamp = timestamp;
  }
}
