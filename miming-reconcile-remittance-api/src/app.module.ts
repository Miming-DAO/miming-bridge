import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ReconcileModule } from './reconcile/reconcile.module';
import { UsdtModule } from './usdt/usdt.module';

import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URL, { dbName: process.env.MONGODB_DATABASE }), 
    ReconcileModule, 
    UsdtModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
