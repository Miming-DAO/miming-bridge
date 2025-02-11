import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LiquidateMSHLDocument = HydratedDocument<LiquidateMSHL>;

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

export class LiquidateMSHL {
    @Prop({ required: true })
    sender_bnb_address: string;

    @Prop({ required: true })
    receiver_xode_address: string;

    @Prop({ required: true })
    particulars: string;

    @Prop({ required: true })
    amount_mshl: number;
    
    @Prop({ required: true })
    mshl_burned_txhash: string;    

    @Prop({ required: true })
    status: string;

    @Prop({ default: Date.now })
    updated_at: Date;
}

export const LiquidateMSHLEntity = SchemaFactory.createForClass(LiquidateMSHL);