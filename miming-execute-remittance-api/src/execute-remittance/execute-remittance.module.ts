import { Module } from '@nestjs/common';
import { ExecuteRemittanceService } from './execute-remittance.service';
import { ExecuteRemittanceController } from './execute-remittance.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ExecuteRemittanceSchema } from './schemas/execute-remittance.schema';

@Module({
  imports:[ MongooseModule.forFeature([{name: 'ExecuteRemittance', schema: ExecuteRemittanceSchema}])],
  controllers: [ExecuteRemittanceController],
  providers: [ExecuteRemittanceService],
})
export class ExecuteRemittanceModule {}
