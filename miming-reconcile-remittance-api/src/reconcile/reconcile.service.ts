import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reconcile } from './entities/remittance.entity';
import axios from 'axios';

@Injectable()
export class ReconcileService {
	constructor(
		@InjectModel(Reconcile.name) private reconcileModel: Model<Reconcile>,
	) { }

	// async getTotalmUSDTBalance(
	// 	status: string,
	// 	date_start: Date,
	// 	date_end: Date
	// ): Promise<any> {
	// 	try {
	// 		const api = process.env.MLHUILLIER_NEXGEN_API as string;
	// 		const endpoint = 'liquidate-xon20/list-burned-musdt';
	// 		const { data: balance } = await axios.get(
	// 			`${api}/${endpoint}/${status}/${date_start}/${date_end}`
	// 		);
	// 		let total_burned_musdt: number = 0;
	// 		balance.forEach((element: any) => {
	// 			total_burned_musdt += element.amount_musdt;
	// 		});
	// 		return { burned_musdt: total_burned_musdt };
	// 	} catch (error: any) {
	// 		return String(error);
	// 	}
	// }

	async getTotalmUSDTBalance(burned_musdt_txhash: string): Promise<any> {
		try {
			const api = process.env.MLHUILLIER_NEXGEN_API as string;
			const endpoint = 'liquidate-xon20/list-burned-musdt';
			const { data: balance } = await axios.get(
				`${api}/${endpoint}/New/2024-09-01/2024-09-30`
			);
			let data: any;
			balance.forEach((element: any) => {
				if (element.musdt_burned_txhash == burned_musdt_txhash) {
					data = element;
				}
			});
			return data;
		} catch (error: any) {
			return String(error);
		}
	}

	async updateRemittanceStatus(musdt_txhash: string): Promise<any> {
		try {
			const response = await axios.put(
				`${process.env.MLHUILLIER_NEXGEN_API}/liquidate-xon20/bulk/update-statuses/reconciled?musdt_burned_txhash=${musdt_txhash}`
			);
			return response.data;
		} catch (error: any) {
			return String(error);
		}
	}

	async saveRemittance(particulars: string, mUSDT: string, txHash: string): Promise<any> {
		try {
			const xode_binance_wallet = process.env.XODE_BINANCE_WALLET as string;
			const createdRemittance = new this.reconcileModel({
				requested_by: xode_binance_wallet,
				requested_datetimestamp: Date.now(),
				amount_musdt: mUSDT,
				particulars: particulars,
				bnb_txhash: txHash,
			});
			const savedRemittance = await createdRemittance.save();
			return savedRemittance;
		} catch (error: any) {
			return String(error);
		}
	}
}
