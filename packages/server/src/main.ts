import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

// 加载环境变量
const envFile = process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.local';
dotenv.config({ path: envFile });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 全局前缀
  app.setGlobalPrefix('api');

  // 全局管道
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // 全局拦截器
  app.useGlobalInterceptors(new ResponseInterceptor());

  // 全局过滤器
  app.useGlobalFilters(new HttpExceptionFilter());

  // 启用 CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  const port = process.env.PORT || 6666;
  await app.listen(port);
  console.log(`Server running on http://localhost:${port}`);
}

bootstrap();
