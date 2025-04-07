import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // 使用register方法动态加载模块
  const appModule = AppModule.register();
  const app = await NestFactory.create(appModule);
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
