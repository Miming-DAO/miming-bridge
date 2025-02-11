import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LiquidateXon20Module } from './liquidate-xon20/liquidate-xon20.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
    envFilePath: '.env',
    isGlobal: true,
  }),
    LiquidateXon20Module,
    MongooseModule.forRoot(process.env.DB_URI, { dbName: process.env.DB_NAME }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {

}
