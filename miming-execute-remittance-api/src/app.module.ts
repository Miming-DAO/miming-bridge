import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExecuteRemittanceModule } from './execute-remittance/execute-remittance.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SendRemittanceController } from './send-remittance/send-remittance.controller';
import { SendRemittanceModule } from './send-remittance/send-remittance.module';
import { BinanceMonitoringController } from './binance-monitoring/binance-monitoring.controller';
import { BinanceMonitoringService } from './binance-monitoring/binance-monitoring.service';
import { BinanceMonitoringModule } from './binance-monitoring/binance-monitoring.module';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { SendRemittanceService } from './send-remittance/send-remittance.service';
import { LiquidateXon20Module } from './liquidate-xon20/liquidate-xon20.module';
import { ExecuteRemittanceService } from './execute-remittance/execute-remittance.service';
import { LiquidateXon20Service } from './liquidate-xon20/liquidate-xon20.service';
import { ExecuteRemittanceSchema } from './execute-remittance/schemas/execute-remittance.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forFeature([{name: 'ExecuteRemittance', schema: ExecuteRemittanceSchema}]),
    MongooseModule.forRoot(process.env.DB_URI, { dbName: process.env.DB_NAME }),
    ExecuteRemittanceModule,
    SendRemittanceModule,
    BinanceMonitoringModule,
    HttpModule,
    ScheduleModule.forRoot(),
    LiquidateXon20Module
  ],
  controllers: [AppController, SendRemittanceController, BinanceMonitoringController],
  providers: [AppService, SendRemittanceService, BinanceMonitoringService, ExecuteRemittanceService,LiquidateXon20Service],
})
export class AppModule {}
