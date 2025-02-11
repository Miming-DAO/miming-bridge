import { Module } from '@nestjs/common';
import { LiquidateXon20Service } from './liquidate-xon20.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MintMHSLSchema } from './schemas/mint-mshl.schema';

@Module({
  imports:[ 
    MongooseModule.forFeature([
      {name: 'MintMHSL', schema: MintMHSLSchema},
    ]),
  ],
  providers: [LiquidateXon20Service]
})
export class LiquidateXon20Module {}
