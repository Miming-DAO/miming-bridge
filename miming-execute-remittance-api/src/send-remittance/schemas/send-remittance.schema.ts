import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export enum Status {
    NEW = "NEW",
    EXECUTED = "EXECUTED",
}
@Schema({
    timestamps:true
})
export class SendRemittance{
    @Prop()
    sender_bnb_address: string;

    @Prop()
    receiver_xode_address: string;

    @Prop()
    particulars: string;

    @Prop()
    amount_usdt: number;

    @Prop()
    amount_mshl: number;

    @Prop()
    bnb_txhash: string;

    @Prop()
    musdt_txhash: string;

    @Prop()
    mshl_txhash: string;

    @Prop()
    status: Status;
}

export const SendRemittanceSchema = SchemaFactory.createForClass(SendRemittance);