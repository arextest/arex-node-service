import { Injectable } from '@nestjs/common';
import { execTestScript } from './execTestScript';

@Injectable()
export class TestService {

  runTestScript({ code, response }) {
    return execTestScript(code, response);
  }
}
