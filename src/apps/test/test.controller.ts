import {
  Body, Controller, Inject,
  Post
} from '@nestjs/common';
import { TestService } from './test.service';

@Controller('test')
export class TestController {

  @Inject()
  private readonly testService: TestService;

  @Post()
  async runTestScript(@Body() body) {

    const { code, response } = body;
    // const response = {
    //   body: [
    //     {
    //       id: 1,
    //       createdAt: '2022-05-02T02:49:42.519Z',
    //       updatedAt: '2022-05-02T15:15:42.000Z',
    //       proposal: '忌卑微',
    //       content:
    //         '应该在什么地方意识到自己渺小?在神和智慧、美和自然的面前，而不是在人们面前。在人们之中你应该意识到自己的尊严。',
    //       from: '《契诃夫书信集》',
    //       profession: '作家',
    //       author: '安东·巴甫洛维奇·契诃夫',
    //       authorOriginName: 'Aнтoн ПaвловиЧ Чexoв',
    //       date: '2022-05-02',
    //       background: '#ffffff',
    //     },
    //     {
    //       id: 2,
    //       createdAt: '2022-05-02T02:49:42.519Z',
    //       updatedAt: '2022-05-02T15:15:42.000Z',
    //       proposal: '忌卑微',
    //       content:
    //         '应该在什么地方意识到自己渺小?在神和智慧、美和自然的面前，而不是在人们面前。在人们之中你应该意识到自己的尊严。',
    //       from: '《契诃夫书信集》',
    //       profession: '作家',
    //       author: '安东·巴甫洛维奇·契诃夫',
    //       authorOriginName: 'Aнтoн ПaвловиЧ Чexoв',
    //       date: '2022-05-02',
    //       background: '#ffffff',
    //     }
    //   ],
    //   status: 200,
    //   type: 'success',
    // };

    // const code = `
    // // Check status code is 200
    // pw.test("Status code is 200", ()=> {
    //  pw.expect(pw.response.status).toBe(200);
    // });
    // pw.test("Status code is 200", ()=> {
    //   pw.expect(pw.response.body[0].id).toBe(1);
    //  });
    // `;

    return this.testService.runTestScript({ code, response });

  }
}
