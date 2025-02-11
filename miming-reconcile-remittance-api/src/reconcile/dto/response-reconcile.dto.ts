import { ApiProperty } from '@nestjs/swagger';

export class ResponseReconcileDto {
  @ApiProperty({ example: '0xabc123...', description: 'The account who requested for reconciliation' })
  requested_by: string;

  @ApiProperty({ example: '2024-08-30T03:01:33.385+00:00', description: 'The date timestamp of when transaction was executed' })
  requested_datetimestamp: string;

  @ApiProperty({ example: '100.00', description: 'The amount of USDT that have been transferred' })
  amount_musdt: string;

  @ApiProperty({ example: 'Transfer', description: 'The particulars for reconciling the token' })
  particulars: string;

  @ApiProperty({ example: '0xabc123...', description: 'The result Binance hash trasferring token' })
  bnb_txhash: string;
}
