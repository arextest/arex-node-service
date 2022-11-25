import { Inject, Injectable } from '@nestjs/common';
import { CaseRequest } from '../model/caserequest';
import { CaseHandleService } from './casehandle.service';
import { DoubleCaseHandleService } from './doublecasehandle.service';
import { NoramlCaseHandleService } from './noramlcasehandle.service';

@Injectable()
export class CaseHandleFactoryService {
  @Inject()
  noramlCaseHandleService: NoramlCaseHandleService;

  @Inject()
  doubleCaseHandleService: DoubleCaseHandleService;

  public select(caseRequest: CaseRequest): CaseHandleService {
    return caseRequest.baseAddress
      ? this.doubleCaseHandleService
      : this.noramlCaseHandleService;
  }
}
