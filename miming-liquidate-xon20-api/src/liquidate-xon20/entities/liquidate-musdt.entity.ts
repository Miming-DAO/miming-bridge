import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LiquidateMUSDTDocument = HydratedDocument<LiquidateMUSDT>;

@Schema({
    toJSON: {
      virtuals: true,
      versionKey: false, 
      transform: (doc, ret) => {
        ret.id = ret._id; 
        delete ret._id;
  
        const { id, ...rest } = ret
        return { id, ...rest };
      },
    }
  })

export class LiquidateMUSDT {
    @Prop({ required: true })
    sender_bnb_address: string;

    @Prop({ required: true })
    receiver_xode_address: string;

    @Prop({ required: true })
    particulars: string;

    @Prop({ required: true })
    amount_musdt: number;

    @Prop({ required: true })
    musdt_burned_txhash: string;

    @Prop({ required: true })
    status: string;

    @Prop({ default: Date.now })
    updated_at: Date;
}

export const LiquidateMUSDTEntity = SchemaFactory.createForClass(LiquidateMUSDT);