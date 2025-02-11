import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosError, AxiosResponse } from 'axios';
import { SendRemittance } from './schemas/send-remittance.schema';
import { catchError, firstValueFrom, Observable } from 'rxjs';
import { BinanceMonitoringService } from 'src/binance-monitoring/binance-monitoring.service';
import { ExecuteRemittanceService } from 'src/execute-remittance/execute-remittance.service';
import { ExecuteRemittance } from 'src/execute-remittance/schemas/execute-remittance.schema';
import { LiquidateXon20Service } from 'src/liquidate-xon20/liquidate-xon20.service';

@Injectable()
export class SendRemittanceService {
    musdtContractAddress = process.env.MUSDT_CONTRACT_ADDRESS as string;
    mshlContractAddress = process.env.MSHL_CONTRACT_ADDRESS as string;
    musdtReceiverAddress = process.env.MUSDT_RECEIVER_WALLET as string;

    private readonly logger = new Logger(SendRemittanceService.name);
    
    constructor(
        private readonly httpService: HttpService,
        private binanceMonitoringService: BinanceMonitoringService,
        private executeRemittanceService: ExecuteRemittanceService,
        private liquidateXon20Service: LiquidateXon20Service
    ) {}

    verifyTxHandler_running = false;
    sendRemittanceArr:any[] = [];

    async getRemittance(){
        try {
            const { data } = await firstValueFrom(
                this.httpService.get<SendRemittance[]>(
                    process.env.SendRemittance_URL
                    + '/send-remittance/list'
                    + '/' + 'New'
                )
                .pipe(
                        catchError((error: AxiosError) => {
                        this.logger.error(error.response);
                        throw 'An error happened!';
                    }),
                ),
            );
            data.forEach( d => {
                const result = this.sendRemittanceArr.find(_d => _d.bnb_txhash == d.bnb_txhash);
                if (result == null) this.sendRemittanceArr.push(d);
            });
    
            console.log(data);
        }
        catch (error:any) {
            this.logger.error(error);
            // console.error(
            //     `getRemittance: error trying to varify transaction: ${error}`
            // );
        }
    }

    async updateSendRemittance(txhash:string, status: string): Promise<SendRemittance[]> {
        const { data } = await firstValueFrom(
            this.httpService.put<SendRemittance[]>(process.env.SendRemittance_URL
                + '/send-remittance/update-status/'
                + txhash + '/'
                + status
            )
            .pipe(
                    catchError((error: AxiosError) => {
                    this.logger.error(error.response.data);
                    throw 'An error happened!';
                }),
            ),
        );
        return data;
    }

    async verifySentRemittance (sendRemittance: any){
        try {
          // execute verify tx if sent
          console.log("recursive call verifyTxHandler hash: ",sendRemittance.bnb_txhash);
           // checking binance transfer

          let musdtTxHash = '';
          this.binanceMonitoringService
            .getBinanceTx(sendRemittance.bnb_txhash)
            .then(async response =>{
                 // mint mshl
                console.log('Minting MUSDT Tokens...')
                console.log(response);
                if(response.status == 1) {
                    // mint musdt
                    let musdt_data = {
                        value: sendRemittance.amount_usdt,
                        to: this.musdtReceiverAddress
                    }
                    return await this.liquidateXon20Service.mintMUSDT(musdt_data, this.musdtContractAddress)
                } else {
                    this.verifyTxHandler_running = false;
                    return null;
                }
            })
            .then(async musdt_txhash =>{
                // mint mshl
                console.log('musd_txhash',musdt_txhash);
                console.log('Minting MSHL Tokens...');
                musdtTxHash = musdt_txhash;
               if(musdt_txhash != null) {
                   // mint mshl
                   let mshl_data = {
                       value: sendRemittance.amount_mshl,
                       to: sendRemittance.receiver
                   }
                   return await this.liquidateXon20Service.mintMSHL(mshl_data, this.mshlContractAddress)
               } else {
                    this.verifyTxHandler_running = false;
                    return null;
               }
            })
            .then(
                async (mshl_data:any) => {
                    console.log('mshl_data',mshl_data);
                    console.log("executeRemittanceService running..");

                    if(mshl_data != null){

                        // insert executed remittance
                        return await this.executeRemittanceService.create({
                            bnb_txhash: sendRemittance.bnb_txhash,
                            sender_bnb_address: sendRemittance.sender,
                            receiver_xode_address: sendRemittance.receiver,
                            particulars: sendRemittance.particulars,
                            amount_usdt: sendRemittance.amount_usdt,
                            amount_mshl: sendRemittance.amount_mshl,
                            musdt_txhash: musdtTxHash,
                            mshl_txhash: mshl_data,
                            status: 'New'
                        });
                    } else{
                        this.verifyTxHandler_running = false;
                        return null;
                    }
                }
            )
            .then( async response => {
                // update income status
                console.log("updateSendRemittance running..");
                console.log(response);
                if(response != null) {
                    // update send remittance status 'EXECUTED'
                    return await this.updateSendRemittance(sendRemittance.bnb_txhash, 'Sent');
                } else {
                    this.verifyTxHandler_running = false;
                    return null;
                }
            })
            .catch((error) => {
                this.logger.debug(error);
            })
            .finally(()=>{
                // remove from the array
                const index = this.sendRemittanceArr.indexOf(sendRemittance);
                if (index > -1) {
                    console.log("deleting index: ", index, " ", sendRemittance)
                    this.sendRemittanceArr.splice(index, 1);
                }
                setTimeout(()=>{
                    if (this.sendRemittanceArr.length == 0) {
                        this.verifyTxHandler_running = false;
                    } else {
                        this.verifySentRemittance(this.sendRemittanceArr[0]);
                    }
                }, 1000)
            });
        } catch (error) {
          console.error(
            `verifyIncomeHandler: error trying to varify transaction: ${error}`
          );
        }
      }

      verifyRemitance() {
        console.log('job call: verifyTxCronJob');
        console.log("sendRemittanceArr",this.sendRemittanceArr)

        if(this.sendRemittanceArr.length > 0 && this.verifyTxHandler_running == false){
            this.verifyTxHandler_running = true;
            this.verifySentRemittance(this.sendRemittanceArr[0]);
        }
    }
}
