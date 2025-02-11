import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RemittancesDocument = HydratedDocument<Remittance>;

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
export class Remittance {
  @Prop({ required: true })
  sender: string;

  @Prop({ required: true })
  receiver: string;

  @Prop({ required: true })
  particulars: string;

  @Prop({ required: true })
  amount_usdt: number;

  @Prop({ required: true })
  amount_mshl: number;

  @Prop({ required: true })
  bnb_txhash: string;

  @Prop({ required: true })
  status: string;
}

export const RemittanceEntity = SchemaFactory.createForClass(Remittance);