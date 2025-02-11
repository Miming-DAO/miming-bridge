import { Module } from '@nestjs/common';
import { SendRemittanceService } from './send-remittance.service';
import { HttpModule } from '@nestjs/axios';
import { SendRemittance, SendRemittanceSchema } from './schemas/send-remittance.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { BinanceMonitoringModule } from 'src/binance-monitoring/binance-monitoring.module';
import { BinanceMonitoringService } from 'src/binance-monitoring/binance-monitoring.service';
import { ExecuteRemittanceService } from 'src/execute-remittance/execute-remittance.service';
import { ExecuteRemittanceModule } from 'src/execute-remittance/execute-remittance.module';
import { ExecuteRemittanceSchema } from 'src/execute-remittance/schemas/execute-remittance.schema';
import { SomeService } from './send.jobs';
import { LiquidateXon20Service } from 'src/liquidate-xon20/liquidate-xon20.service';
import { LiquidateXon20Module } from 'src/liquidate-xon20/liquidate-xon20.module';
@Module({

  imports: [
    BinanceMonitoringModule,
    ExecuteRemittanceModule,
    LiquidateXon20Module,
    MongooseModule.forFeature([
      {name: 'SendRemittance', schema: SendRemittanceSchema},
      {name: 'ExecuteRemittance', schema: ExecuteRemittanceSchema}
    ]),
    HttpModule
  ],
  providers: [SendRemittanceService,BinanceMonitoringService,ExecuteRemittanceService, SomeService, LiquidateXon20Service]
})
export class SendRemittanceModule {}
