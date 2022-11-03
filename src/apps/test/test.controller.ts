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

  // @Get("/send")
  // async runTest() {
  //   let headerArray: Array<KeyValuePairType> = [];
  //   let key1 = new KeyValuePairType();
  //   key1.key = "access-token"
  //   key1.value = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpbmZvIjoidGVzdCJ9.YeLmUW--fqrtmag1QTDmL8U7RVZlb34xPAAxorxSCPM"
  //   headerArray.push(key1)

  //   let headers = {};
  //   headerArray.forEach(({ key, value }) => {
  //     headers[key] = value;
  //   });

  //   let result1: Observable<any> = this.httpService
  //     .get('http://127.0.0.1:8080/api/config/schedule/useResult/appId/arex.1.20220909A', {
  //       headers: headers
  //     })
  //     .pipe(
  //       map(res => {
  //         return { "status": res.status, "statusText": res.statusText, "headers": res.headers, "data": res.data };
  //       }),
  //       timeout(5000),
  //       catchError(error => of(`${error}`))
  //     );

  //   let result2: Observable<any> = this.httpService
  //     .get('http://127.0.0.1:8081/api/config/schedule/useResult/appId/arex.1.20220909A', {
  //       headers: headers
  //     })
  //     .pipe(
  //       // map((res: { data: any; }) => res.data),
  //       timeout(5000),
  //       catchError(error => of(`${error}`))
  //     );

  //   let array = [];
  //   array.push(result1);
  //   array.push(result2);

  //   let observable = forkJoin([...array])
  //   // .pipe(
  //   //   map(res => {
  //   //     return ["hh","aa"].map((key, index) => {
  //   //       if (typeof res[index] === "string") {
  //   //         console.log("1111")
  //   //       }
  //   //       console.log("key:", key)
  //   //       console.log("res:", res)
  //   //       return { key, data: res[index] }
  //   //     })
  //   //   })
  //   // );

  //   // observable.forEach(item => {
  //   //   console.log(item)
  //   // })

  //   // observable.subscribe(res => {
  //   //   console.log(typeof res)
  //   //   console.log((res as Array<any>)[0])
  //   //   console.log((res as Array<any>)[1])
  //   //   console.log("111", res);
  //   // })

  //   const res = await new Promise<Array<any>>(
  //     (resolve) => {
  //       observable.subscribe(item => {
  //         resolve(item)
  //       })
  //     }
  //   )
  //   console.log(typeof res);
  //   console.log(res[0]);
  //   console.log("-----------------------------------------");
  //   console.log(res[1]);
  //   console.log(res.length);

  //   // const res = await new Promise(
  //   //   (resolve) => {
  //   //     result.subscribe(item => {
  //   //       resolve(item)
  //   //     })
  //   //   }
  //   // )
  //   console.log("finish");
  //   return Promise.resolve("1111");
  //   // return "111";
  //   // console.log(res);
  //   // return res;
  // }
}
