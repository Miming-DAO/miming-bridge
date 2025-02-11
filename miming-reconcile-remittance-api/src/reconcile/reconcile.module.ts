import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ReconcileService } from './reconcile.service';
import { ReconcileController } from './reconcile.controller';

import { Reconcile, ReconcileEntity } from './entities/remittance.entity'; 

import { USDTService } from 'src/usdt/usdt.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Reconcile.name, schema: ReconcileEntity }])],
  controllers: [ReconcileController],
  providers: [ReconcileService, USDTService],
})
export class ReconcileModule {}
