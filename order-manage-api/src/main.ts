import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './exceptions/http-exception.filter';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { setupSwagger } from './swagger';
import contextService from 'request-context';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    app.use(contextService.middleware('request'));
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new TransformInterceptor());
    setupSwagger(app);
    await app.listen(3000);
}

bootstrap();
