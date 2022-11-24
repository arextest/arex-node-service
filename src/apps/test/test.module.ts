import { Module } from '@nestjs/common';
import { TestController } from './controller/test.controller';
import { PreTestService } from './service/pretest.service';
import { TestService } from './service/test.service';

@Module({
  controllers: [TestController],
  providers: [TestService, PreTestService],
  exports: [TestService, PreTestService]
})
export class TestModule { }
