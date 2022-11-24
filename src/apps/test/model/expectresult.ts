export class ExpectResult {
  status: any;
  message: any;
  leftValue: any;
  rightValue: any;

  constructor(status: any, message: any, leftValue: any, rightValue: any) {
    this.status = status;
    this.message = message;
    this.leftValue = leftValue;
    this.rightValue = rightValue;
  }
}
