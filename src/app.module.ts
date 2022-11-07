import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CaseSendModule } from './apps/casesend/casesend.module';
import { TestModule } from './apps/test/test.module';

@Module({
  imports: [TestModule, CaseSendModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
