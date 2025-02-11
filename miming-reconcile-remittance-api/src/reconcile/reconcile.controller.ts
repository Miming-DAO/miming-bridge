import { Controller, Get, Post, Put, Body, Patch, Param, Delete, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiCreatedResponse, ApiResponse } from '@nestjs/swagger';
import { ReconcileService } from './reconcile.service';
import { ResponseReconcileDto } from './dto/response-reconcile.dto';
import { USDTService } from 'src/usdt/usdt.service';
import * as dotenv from 'dotenv';

dotenv.config();

@ApiTags('Reconciliation')
@Controller('api')
export class ReconcileController {
	constructor(
		private readonly reconcileService: ReconcileService,
		private readonly usdtService: USDTService
	) { }

	@Post('reconcile-musdt/:burned_musdt_txhash')
	@ApiOperation({ summary: 'Reconcile remittances based on the given burned mUSDT transaction hash' })
	@ApiParam({ name: 'burned_musdt_txhash', example: '0xabc123...', type: String, description: 'The transaction hash of the burned mUSDT' })
	@ApiCreatedResponse({ description: 'Remittance reconciled successfully', type: ResponseReconcileDto })
	@ApiResponse({ status: 400, description: 'Bad Request' })
	@ApiResponse({ status: 500, description: 'Internal Server Error' })
	async reconcile(
		@Param('burned_musdt_txhash') burned_musdt_txhash: string, 
	): Promise<any> {
		try {
			let data: string = 'Reconciled'
			const xode_binance_wallet = process.env.XODE_BINANCE_WALLET as string;
			const receiver = process.env.MLHUILLIER_BINANCE_WALLET as string;
			const [mUSDT, usdtBalance] = await Promise.all([
				this.reconcileService.getTotalmUSDTBalance(burned_musdt_txhash),
				this.usdtService.getBalance(xode_binance_wallet)
			]);
			if (mUSDT.amount_musdt != 0) {
				const [transferTxHash, ] = await Promise.all([
					this.usdtService.transfer(receiver, parseFloat(mUSDT.amount_musdt)),
					this.reconcileService.updateRemittanceStatus(burned_musdt_txhash),
				]);
				const result = await this.reconcileService.saveRemittance(
					data, 
					mUSDT.amount_musdt, 
					transferTxHash
				);
				return result;
			} else {
				const musdt = parseFloat(mUSDT.amount_musdt).toFixed(6);
				const usdt = parseFloat(usdtBalance).toFixed(6);
				throw Error(`Cannot execute: Balances do not match or both zero. USDT: ${usdt} while mUSDT: ${musdt}`);
			}
		} catch (error) {
			throw new HttpException({
				status: HttpStatus.INTERNAL_SERVER_ERROR,
				error: error.toString() || 'Internal server error',
			}, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
