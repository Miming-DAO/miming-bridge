import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { RemittancesService } from './remittances.service';
import { RemittancesController } from './remittances.controller';

import { Remittance, RemittanceEntity } from './entities/remittance.entity'; 

import { USDTService } from 'src/usdt/usdt.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Remittance.name, schema: RemittanceEntity }])],
  controllers: [RemittancesController],
  providers: [RemittancesService, USDTService],
})
export class RemittancesModule {}
