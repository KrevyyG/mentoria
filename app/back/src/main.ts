import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { ExcecaoGlobalFilter } from './common/filters/excecao-global.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix('api')
  app.enableCors()

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  app.useGlobalFilters(new ExcecaoGlobalFilter())

  const config = new DocumentBuilder()
    .setTitle('QAlificado - To Do')
    .setDescription('API multiusuário para gerenciar tarefas e categorias.')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'jwt',
    )
    .build()
  const documento = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/docs', app, documento, {
    swaggerOptions: { persistAuthorization: true },
  })

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
