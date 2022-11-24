import { Injectable } from '@nestjs/common';
import { ExecScriptResult } from '../model/execscriptresult';
import { TestField } from '../model/testfield';
import { execTestScript } from './exectestscript';

@Injectable()
export class TestService {

  runTestScript(code: string, testField: TestField): Promise<ExecScriptResult> {
    return execTestScript(code, testField);
  }
}
