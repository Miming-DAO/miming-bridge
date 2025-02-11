import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { RemittancesModule } from './remittances/remittances.module';
import { UsdtModule } from './usdt/usdt.module';

import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URL, { dbName: process.env.MONGODB_DATABASE }), 
    RemittancesModule, 
    UsdtModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
