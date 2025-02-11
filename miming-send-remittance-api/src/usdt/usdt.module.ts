import { Module } from '@nestjs/common';
import { USDTService } from './usdt.service';

@Module({
  imports: [],
  controllers: [],
  providers: [USDTService],
})
export class UsdtModule {}
