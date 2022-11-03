import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
// import { Cat } from './Cat';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('/test')
  getHello(): string {
    return this.appService.getHello();
  }

  // @Post("setCat")
  // setCat(@Body() cat: Cat): Cat {

  //   console.log(cat);
  //   cat.objct.name = 18 + '';
  //   return cat;
  // }

}