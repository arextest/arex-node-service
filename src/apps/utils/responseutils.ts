import { GenericResponseType } from '../casesend/model/genericresonsetype';
import { CommonResponse } from '../casesend/model/response';
import { ResponseCode } from '../casesend/model/responsecode';
import { ResponseStatusType } from '../casesend/model/responsestatustype';

export class ResponseUtils {
  static exceptionResponse(remark: string): CommonResponse {
    return this.errorResponse(remark, ResponseCode.REQUESTED_HANDLE_EXCEPTION);
  }

  static errorResponse(remark: string, responseCode: number): CommonResponse {
    return this.create(this.responseStatus(remark, responseCode), null);
  }

  static successResponse<T>(body: T): CommonResponse {
    return this.create(
      this.responseStatus('success', ResponseCode.SUCCESS),
      body,
    );
  }

  private static create<T>(
    statusType: ResponseStatusType,
    body: T,
  ): CommonResponse {
    return new GenericResponseType(statusType, body);
  }

  private static responseStatus(
    remark: string,
    responseCode: number,
  ): ResponseStatusType {
    const timestamp = Date.parse(new Date().toString());
    return new ResponseStatusType(responseCode, remark, timestamp);
  }
}
