import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CaseSendController } from './controller/casesend.controller';
import { CaseSendService } from './service/casesend.service';
import { TestModule } from '../test/test.module';
import { NoramlCaseHandleService } from './service/noramlcasehandle.service';
import { DoubleCaseHandleService } from './service/doublecasehandle.service';
import { CaseHandleFactoryService } from './service/casehandlefactory.service';
import { BuildSendTaskSerive } from './service/buildSendTask.servce';

@Module({
  imports: [HttpModule, TestModule],
  controllers: [CaseSendController],
  providers: [CaseSendService, CaseHandleFactoryService, NoramlCaseHandleService, DoubleCaseHandleService, BuildSendTaskSerive]
})
export class CaseSendModule { }
