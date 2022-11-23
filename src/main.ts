import { NestFactory } from '@nestjs/core';
import { prepareInit } from "./utils/prepareInit";

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
