import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Keyring } from '@polkadot/api';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { MintMHSL } from './schemas/mint-mshl.schema';
import InitializeAPI from 'src/modules/InitializeAPI';
import abi from 'src/contracts/xode_xon20.json';
import TXRepository from 'src/modules/TXRepository';
import { ContractPromise } from '@polkadot/api-contract';
@Injectable()
export class LiquidateXon20Service {
    contractOwner = process.env.CONTRACT_OWNER as string;
    mshlOwnerSeed = process.env.MSHL_OWNER_SEED as string;
    musdtOwnerSeed = process.env.MUSDT_OWNER_SEED as string;

    constructor(
        // @InjectModel(LiquidateXon20Service.name)
        // // private mintMHSL: mongoose.Model<MintMHSL>
      ){}

      async mintMSHL(data: any, contractAddress: string){
        console.log('mintRepo function was called');
        var api: any;
        try {
          await cryptoWaitReady();
          api = await InitializeAPI.apiInitialization();
          if (api instanceof Error) {
            return api;
          }
          const contract = await new ContractPromise(api, abi, contractAddress);
          const keyring = new Keyring({ type: 'sr25519', ss58Format: 0 });
          const owner = keyring.addFromUri(this.mshlOwnerSeed);
          const value = data.value * 10 ** 12;
          const storageDepositLimit = null;
          if (!contract) {
            return Error('Contract not initialized!');
          }
          const result: any = await TXRepository.sendContractTransaction(
            api,
            contract,
            'mint',
            owner,
            [
              data.to,
              value 
            ],
            this,
            storageDepositLimit
          );
          console.log(result);
          return result.data.txhash;
        } catch (error: any) {
          console.log('mintRepo: ', error);
          return Error(error);
        } finally {
          if (!(api instanceof Error)) {
            await api.disconnect();
          }
        }
      }

      async mintMUSDT(data: any, contractAddress: string){
        console.log('mintRepo function was called');
        var api: any;
        try {
          await cryptoWaitReady();
          api = await InitializeAPI.apiInitialization();
          if (api instanceof Error) {
            return api;
          }
          const contract = await new ContractPromise(api, abi, contractAddress);
          const keyring = new Keyring({ type: 'sr25519', ss58Format: 0 });
          const owner = keyring.addFromUri(this.musdtOwnerSeed);
          const value = data.value * 10 ** 12;
          const storageDepositLimit = null;
          if (!contract) {
            return Error('Contract not initialized!');
          }
          const result: any = await TXRepository.sendContractTransaction(
            api,
            contract,
            'mint',
            owner,
            [
              data.to,
              value 
            ],
            this,
            storageDepositLimit
          );
          console.log(result);
          return result.data.txhash;
        } catch (error: any) {
          console.log('mintRepo: ', error);
          return Error(error);
        } finally {
          if (!(api instanceof Error)) {
            await api.disconnect();
          }
        }
      }

      
    
}
