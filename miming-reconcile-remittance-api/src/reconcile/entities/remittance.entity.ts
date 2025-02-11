import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RemittancesDocument = HydratedDocument<Reconcile>;

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
export class Reconcile {
  @Prop({ required: true })
  requested_by: string;

  @Prop({ required: true, default: Date.now })
  requested_datetimestamp: Date;

  @Prop({ required: true })
  amount_musdt: string;

  @Prop({ required: true })
  particulars: string;

  @Prop({ required: true })
  bnb_txhash: string;
}

export const ReconcileEntity = SchemaFactory.createForClass(Reconcile);