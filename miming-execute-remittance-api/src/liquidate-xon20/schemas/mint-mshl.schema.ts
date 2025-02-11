import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
    timestamps:true
})
export class MintMHSL{

    @Prop({ required: true })
    to: string;
    
    @Prop({ required: true })
    value: number;  
}

export const MintMHSLSchema = SchemaFactory.createForClass(MintMHSL);