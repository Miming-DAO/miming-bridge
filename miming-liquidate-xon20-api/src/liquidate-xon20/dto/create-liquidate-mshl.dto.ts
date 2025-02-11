import { ApiProperty } from "@nestjs/swagger";

export class CreateLiquidateMSHLDto {
    @ApiProperty({type: String, description: 'This is a required property'})
    sender_bnb_address: string;

    @ApiProperty({type: String, description: 'This is a required property'})
    receiver_xode_address: string;

    @ApiProperty({type: String, description: 'This is a required property'})
    particulars: string;

    @ApiProperty({type: Number, description: 'This is a required property'})
    amount_mshl: number;

    @ApiProperty({type: String, description: 'This is a required property'})
    mshl_burned_txhash: string;

    @ApiProperty({type: String, description: 'This is a required property'})
    status: string;
    
    @ApiProperty({type: Date, description: 'This is an optional property'})
    updated_at: Date;
}
