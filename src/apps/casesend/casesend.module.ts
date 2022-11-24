import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CaseSendController } from './controller/casesend.controller';
import { CaseSendService } from './service/casesend.service';
import { TestModule } from '../test/test.module';
import { NoramlCaseHandleService } from './service/noramlcasehandle.service';
import { DoubleCaseHandleService } from './service/doublecasehandle.service';
import { CaseHandleFactoryService } from './service/casehandlefactory.service';
import { BuildSendTaskSerive } from './service/buildsendtask.servce';
import { ProprecessService } from './service/preprocess.service';

@Module({
  imports: [HttpModule, TestModule],
  controllers: [CaseSendController],
  providers: [
    CaseSendService,
    ProprecessService,
    CaseHandleFactoryService,
    NoramlCaseHandleService,
    DoubleCaseHandleService,
    BuildSendTaskSerive,
  ],
})
export class CaseSendModule {}
