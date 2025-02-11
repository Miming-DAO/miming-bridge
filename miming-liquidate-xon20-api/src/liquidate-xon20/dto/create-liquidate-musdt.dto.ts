import { ApiProperty } from "@nestjs/swagger";

export class CreateLiquidateMUSDTDto {
    @ApiProperty({type: String, description: 'This is a required property'})
    sender_bnb_address: string;

    @ApiProperty({type: String, description: 'This is a required property'})
    receiver_xode_address: string;

    @ApiProperty({type: String, description: 'This is a required property'})
    particulars: string;

    @ApiProperty({type: Number, description: 'This is a required property'})
    amount_musdt: number;

    @ApiProperty({type: String, description: 'This is a required property'})
    musdt_burned_txhash: string;

    @ApiProperty({type: String, description: 'This is a required property'})
    status: string;
}
