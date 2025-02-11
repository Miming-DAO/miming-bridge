import { Module } from '@nestjs/common';
import { LiquidateXon20Service } from './liquidate-xon20.service';
import { LiquidateXon20Controller } from './liquidate-xon20.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LiquidateMUSDT, LiquidateMUSDTEntity } from './entities/liquidate-musdt.entity';
import { LiquidateMSHL, LiquidateMSHLEntity } from './entities/liquidate-mshl.entity';

@Module({
  imports: [MongooseModule.forFeature([
    { name: LiquidateMUSDT.name, schema: LiquidateMUSDTEntity },
    { name: LiquidateMSHL.name, schema: LiquidateMSHLEntity}
  ])],
  controllers: [LiquidateXon20Controller],
  providers: [LiquidateXon20Service],
})
export class LiquidateXon20Module {}
