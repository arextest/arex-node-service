export class ResponseStatusType {
    responseCode: Number;
    responseDesc: string;
    timestamp: Number;

    constructor(responseCode: Number, responseDesc: string, timestamp: Number) {
        this.responseCode = responseCode;
        this.responseDesc = responseDesc;
        this.timestamp = timestamp;
    }


}