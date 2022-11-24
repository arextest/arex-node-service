import { NestFactory } from '@nestjs/core';
import { LoggerService } from './logger.service';
import { prepareInit } from "./utils/prepareInit";

const logService = new LoggerService("ListenError");
async function bootstrap() {
  prepareInit();
  const { AppModule } = await import('./app.module');

  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'debug', 'warn', 'error']
  });
  app.enableCors()
  await app.listen(3000);
}
bootstrap();

process.on('unhandledRejection', (error, promise) => {
  logService.error("unhandledRejection:", error)
})

process.on('uncaughtException', (error) => {
  // 异常可以选择不退出
  logService.error("uncaughtException:", error)
});

process.on('exit', (code) => {
  logService.error("exit code:", code)
});