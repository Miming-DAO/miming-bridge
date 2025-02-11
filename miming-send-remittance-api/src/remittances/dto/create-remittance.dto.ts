import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateRemittanceDto {
    @ApiProperty({type: String, description: 'This is a required property', default: "0x956D37f4Bc65688767Ff94f70141E5dcEBDF64b4"})
    sender: string;

    @ApiProperty({type: String, description: 'This is a required property'})
    receiver: string;

    @ApiProperty({type: String, description: 'This is a required property'})
    particulars: string;

    @ApiProperty({type: Number, description: 'This is a required property'})
    amount_usdt: number;

    @ApiProperty({type: Number, description: 'This is a required property'})
    amount_mshl: number;

    @ApiProperty({type: String, description: 'This is a required property'})
    bnb_txhash: string;
}
