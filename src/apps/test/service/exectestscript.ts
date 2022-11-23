import { AxiosRequestConfig } from 'axios';
import { LoggerService } from '../../../logger.service';
import { CaseResult } from "../model/caseresult";
import { ExecScriptResult } from "../model/execscriptresult";
import { TestField } from "../model/testfield";
const vm = require('vm');
const axios = require('axios');
const mysql = require('mysql2/promise');
const logService = new LoggerService(execTestScript.name);


class Pw extends TestField {

  caseResult: CaseResult = new CaseResult('root', [], []);

  firstLvIndex = -1;
  secondLvIndex = -1;

  constructor(testField: TestField) {
    super();
    this.request = testField.request;
    this.response = testField.response;
    this.environment = testField.environment;
  }

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
    ].message = `Expected ${this.caseResult.children[this.firstLvIndex].expectResults[
      this.secondLvIndex
    ].leftValue
    } to be ${this.caseResult.children[this.firstLvIndex].expectResults[
      this.secondLvIndex
    ].rightValue}'`;
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
    ].rightValue}'`;
  }

  async sendRequest(url: string | AxiosRequestConfig<string>, callback) {
    if (typeof url == "string") {
      let response = undefined;
      try {
        response = await axios.get(url);
      } catch (err) {

        try {
          callback(err, null);
        } catch (error) {
          logService.error(error.message);
        }
        return;

      }

      try {
        callback(null, response);
      } catch (error) {
        logService.error(error.message);
      }

    } else {

      let response = undefined;
      try {
        response = await axios(url);
      } catch (err) {

        try {
          callback(err, null);
        } catch (error) {
          logService.error(error.message);
        }
        return;

      }

      try {
        callback(null, response);
      } catch (error) {
        logService.error(error.message);
      }

    }
  }

  async executeMySql(connectConfig: { host: string, port: string, user: string, password: string, database: string, multipleStatements?: boolean },
    executeBody: { sql: string, params?: [unknown] }, callback) {

    let db = undefined
    try {
      db = await mysql.createConnection(connectConfig);
    } catch (error) {
      try {
        callback(error, undefined);
      } catch (error) {
        console.log("have problem");
      }
      return;
    }

    let res1 = undefined;

    try {
      res1 = await db.query(executeBody.sql, executeBody.params);
      await db.end();
    } catch (error) {
      try {
        callback(error, undefined);
      } catch (error) {
        console.log("have problem");
      }
      await db.end();
      return;
    }

    try {
      callback(null, res1[0]);
    } catch (error) {
      console.log("have problem");
    }
  }
}

export function execTestScript(code: string, testField: TestField): Promise<ExecScriptResult> {
  return new Promise<ExecScriptResult>((resolve, reject) => {
    const pw = new Pw(testField);
    const sandbox = {
      arex: pw,
      console: console,
      JSON: JSON,
    };

    const testPromise = vm.runInNewContext(code, sandbox);
    if (testPromise instanceof Promise) {
      testPromise.then(() => {
        resolve({ caseResult: pw.getCaseResult(), environment: pw.environment });
      }).catch((err) => {
        reject(err);
      })
    } else {
      resolve({ caseResult: pw.getCaseResult(), environment: pw.environment });
    }
  });

}


