import { Module } from '@nestjs/common';
import { BinanceMonitoringService } from './binance-monitoring.service';
import { HttpModule } from '@nestjs/axios';
import { SendRemittanceModule } from 'src/send-remittance/send-remittance.module';

@Module({
    imports: [
      HttpModule,
    ],
    providers: [BinanceMonitoringService]
  })
export class BinanceMonitoringModule {}
