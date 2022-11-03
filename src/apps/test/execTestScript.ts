import { CaseResult } from "../test/model/caseresult";
const vm = require('vm');
class Pw {
  constructor(response) {
    this.response = response;
  }
  caseResult: CaseResult = new CaseResult('root', [], []);

  firstLvIndex = -1;
  secondLvIndex = -1;
  getCaseResult(): CaseResult {
    return this.caseResult;
  }
  test(descriptor, callback) {
    // 一级索引每次+1
    this.firstLvIndex = this.firstLvIndex + 1;
    // 二级索引每次归0
    this.secondLvIndex = -1;
    // 添加初始数据
    this.caseResult.children.push({
      descriptor: descriptor,
      expectResults: [],
      children: [],
    });
    callback();
  }
  response = {};
  expect(leftValue) {
    // 执行到expect，二级索引+1
    this.secondLvIndex = this.secondLvIndex + 1;
    this.caseResult.children[this.firstLvIndex].expectResults.push({
      status: '',
      message: '',
      leftValue: undefined,
      rightValue: undefined,
    });
    this.caseResult.children[this.firstLvIndex].expectResults[
      this.secondLvIndex
    ].leftValue = leftValue;
    return this;
  }
  toBe(rightValue) {
    this.caseResult.children[this.firstLvIndex].expectResults[
      this.secondLvIndex
    ].rightValue = rightValue;
    // a
    if (
      this.caseResult.children[this.firstLvIndex].expectResults[
        this.secondLvIndex
      ].leftValue ===
      this.caseResult.children[this.firstLvIndex].expectResults[
        this.secondLvIndex
      ].rightValue
    ) {
      this.caseResult.children[this.firstLvIndex].expectResults[
        this.secondLvIndex
      ].status = 'pass';
    } else {
      this.caseResult.children[this.firstLvIndex].expectResults[
        this.secondLvIndex
      ].status = 'fail';
    }
    // b
    this.caseResult.children[this.firstLvIndex].expectResults[
      this.secondLvIndex
    ].message = `Expected ${
      this.caseResult.children[this.firstLvIndex].expectResults[
        this.secondLvIndex
      ].leftValue
    } to be ${
      this.caseResult.children[this.firstLvIndex].expectResults[
        this.secondLvIndex
      ].rightValue
    }'`;
  }
  toBeLevel2xx(rightValue) {
    this.caseResult.children[this.firstLvIndex].expectResults[
      this.secondLvIndex
    ].rightValue = rightValue;
    // a
    if (
      this.caseResult.children[this.firstLvIndex].expectResults[
        this.secondLvIndex
      ].leftValue > 200 &&
      this.caseResult.children[this.firstLvIndex].expectResults[
        this.secondLvIndex
      ].leftValue < 299
    ) {
      this.caseResult.children[this.firstLvIndex].expectResults[
        this.secondLvIndex
      ].status = 'pass';
    } else {
      this.caseResult.children[this.firstLvIndex].expectResults[
        this.secondLvIndex
      ].status = 'fail';
    }
    // b
    this.caseResult.children[this.firstLvIndex].expectResults[
      this.secondLvIndex
    ].message = `Expected ${this.caseResult.children[this.firstLvIndex].expectResults[
      this.secondLvIndex
    ].leftValue
    } to be ${this.caseResult.children[this.firstLvIndex].expectResults[
      this.secondLvIndex
    ].rightValue
      }'`;
  }
}
export function execTestScript(code, response) {
  return new Promise<CaseResult>((resolve, reject) => {
    const pw = new Pw(response);
    const sandbox = {
      arex: pw,
      console: console,
      JSON:JSON
    };
    //必须传入第二个参数，sandbox或context
    vm.runInNewContext(code, sandbox);
    resolve(pw.getCaseResult());
  });
}
