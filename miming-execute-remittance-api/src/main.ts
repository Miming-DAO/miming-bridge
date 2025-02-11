import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('MLhuillier Execute Remittance API')
    .setDescription('Listens to Binance Smart Chain events and execute minting of XON20 tokens based on remittance information.')
    .setVersion('1.0')
    .addTag('Execute Remittance')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
