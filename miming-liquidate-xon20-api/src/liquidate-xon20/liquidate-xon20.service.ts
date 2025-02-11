import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateLiquidateMUSDTDto } from './dto/create-liquidate-musdt.dto';
import { UpdateLiquidateMUSDTDto } from './dto/update-liquidate-musdt.dto';
import { InjectModel } from '@nestjs/mongoose';
import { LiquidateMUSDT } from './entities/liquidate-musdt.entity';
import { Model } from 'mongoose';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import InitializeAPI from 'src/modules/initializeAPI';
import abi from './../contract/xode_xon20.json';
import { Keyring, WsProvider } from '@polkadot/api';
import TXRepository from 'src/modules/TXRepository';
import https from 'https';
import http from 'http';
import PolkadotUtility from 'src/modules/PolkadotUtility';
import { CreateLiquidateMSHLDto } from './dto/create-liquidate-mshl.dto';
import { LiquidateMSHL } from './entities/liquidate-mshl.entity';
import { MUSDTTxHashData } from 'src/models/musdtTXHashData.interface';
import { MSHLTxHashData } from 'src/models/mshlTXHashData.interface';
import { ContractPromise } from '@polkadot/api-contract';
@Injectable()
export class LiquidateXon20Service {
  musdtContractAddress = process.env.MUSDT_CONTRACT_ADDRESS as string;
  musdtContractOwner = process.env.MUSDT_CONTRACT_OWNER as string;
  musdtOwnerSeed = process.env.MUSDT_OWNER_SEED as string;

  mshlContractAddress = process.env.MSHL_CONTRACT_ADDRESS as string;
  mshlContractOwner = process.env.MSHL_CONTRACT_OWNER as string;
  mshlOwnerSeed = process.env.MSHL_OWNER_SEED as string;

  

  constructor(
    @InjectModel(LiquidateMUSDT.name) private LiquidateMUSDTModel: Model<LiquidateMUSDT>,
    @InjectModel(LiquidateMSHL.name) private LiquidateMSHLModel: Model<LiquidateMSHL>
  ){

  }

  GetMUSDTTXHash(url: string, bnb_txhash: string): Promise<any> {
    return new Promise((resolve, reject) => {
      https.get(`${url}/execute-remittance/get-musdt-info/${bnb_txhash}`, (res) => {
        let data = '';
  
        res.on('data', (chunk) => {
          data += chunk;
        });
  
        res.on('end', () => {
  
          try {
            if (data === "") {
              resolve(data);
            }else{
              const parsedData = JSON.parse(data);
              resolve(parsedData);
            }
          } catch (error) {
            reject(new Error(`Error parsing JSON: ${error.message}`));
          }
        });
      }).on('error', (error) => {
        reject(new Error(`Error with request: ${error.message}`));
      });
    });
  }

  UpdateMUSDTTXHash(url, musdt_burned_txhash, status) {
    console.log("Update MUSDT by TXHash is called")
    return new Promise((resolve, reject) => {
      const options = {
        method: 'PUT',
      };
  
      const req = https.request(`${url}/execute-remittance/update-status/${musdt_burned_txhash}/${status}`, options, (res) => {
        let data = '';
  
        // Concatenate data chunks
        res.on('data', (chunk) => {
          data += chunk;
        });
  
        // Resolve with the complete data once the response ends
        res.on('end', () => {
          try {
            const parsedData = JSON.parse(data);
            resolve(parsedData);
          } catch (error) {
            reject(`Error parsing JSON: ${error.message}`);
          }
        });
      });
  
      // Handle errors with the request
      req.on('error', (error) => {
        reject(`Error with request: ${error.message}`);
      });
  
      // End the request
      req.end();
    });
  }

  async saveLiquidateMUSDT(createLiquidateXon20Dto: CreateLiquidateMUSDTDto): Promise<MUSDTTxHashData> {
    try{
      console.log("save liquidate MUSDT Called")
      const createdRemittance = new this.LiquidateMUSDTModel({
        sender_bnb_address: createLiquidateXon20Dto.sender_bnb_address,
        receiver_xode_address: createLiquidateXon20Dto.receiver_xode_address,
        particulars: createLiquidateXon20Dto.particulars,
        amount_musdt: createLiquidateXon20Dto.amount_musdt,
        musdt_burned_txhash: createLiquidateXon20Dto.musdt_burned_txhash,
        status: createLiquidateXon20Dto.status,
      });
      return createdRemittance.save();
    }catch (error: any) {
      return error;
    }
  }

  async burnToken(data: any, contractAddress: string, ownerSeed: string){
    console.log('burnRepo function was called');
    var api: any;
    try {
      await cryptoWaitReady();
      api = await InitializeAPI.apiInitialization();
      if (api instanceof Error) {
        return api;
      }
      const contract = await new ContractPromise(api, abi, contractAddress);
      const keyring = new Keyring({ type: 'sr25519', ss58Format: 0 });
      const owner = keyring.addFromUri(ownerSeed);
      const storageDepositLimit = null;
      if (!contract) {
        return Error('Contract not initialized!');
      }
      const result: any = await TXRepository.sendContractTransaction(
        api,
        contract,
        'burn',
        owner,
        [data.walletAddress,data.balance],
        this,
        storageDepositLimit
      )
      console.log(result);
      return result;
    } catch (error: any) {
      console.log('burnRepo Error: ', error);
      return Error(error);
    } finally {
      if (!(api instanceof Error)) {
        await api.disconnect();
      }
    }
  }

  async liquidateMUSDT(bnb_txhash: string): Promise<any> {
    return await this.GetMUSDTTXHash(process.env.EXECUTE_REMITTANCE_API, bnb_txhash)
    .then( async (response:any) => {
      console.log(response);
      if(response==""){
        return new BadRequestException("No execute remittance records found");
      }else{
        let musdtData = {
          walletAddress: this.musdtContractOwner,
          balance: response.amount_usdt * 10 ** 12
        }
        var createLiquidateRecord = new this.LiquidateMUSDTModel({
          sender_bnb_address: response.sender_bnb_address,
          receiver_xode_address: response.receiver_xode_address,
          particulars: response.particulars,
          amount_musdt: response.amount_usdt,
          musdt_burned_txhash: "",
          status: "New",
        });
        
        return await this.burnToken(musdtData, this.musdtContractAddress, this.musdtOwnerSeed)
        .then( async (response:any) => {
          createLiquidateRecord.musdt_burned_txhash = response.data.txhash;
          return await this.UpdateMUSDTTXHash(process.env.EXECUTE_REMITTANCE_API, bnb_txhash,'Executed')
          .then(async (response:any)=>{
            return await this.saveLiquidateMUSDT(createLiquidateRecord)
            .then(savedRecord => {
              return savedRecord; // Or whatever you want to return
            })
            .catch((error) => {
              throw new Error(error);
            });
          }).catch((error) => {
            throw new Error(error);
          })
        }).catch((error) => {
          throw new Error(error);
        })
      }
    }).catch((error) => {
      throw new Error(error);
      // return error;
      // return { message: error.message || "An unexpected error occurred" };
    })
  }

  GetMSHLTXHash(url: string,bnb_txhash:string){
    return new Promise((resolve, reject) => {
      https.get(`${url}/execute-remittance/get-mshl-info/${bnb_txhash}`, (res) => {
        let data = '';
  
        res.on('data', (chunk) => {
          data += chunk;
        });
  
        res.on('end', () => {
  
          try {
            if (data === "") {
              
              resolve(data);
            }else{
              const parsedData = JSON.parse(data);
              resolve(parsedData);
            }
          } catch (error) {
            reject(new Error(`Error parsing JSON: ${error.message}`));
          }
        });
      }).on('error', (error) => {
        reject(new Error(`Error with request: ${error.message}`));
      });
    });
  }

  async saveLiquidateMSHL(createLiquidateXon20Dto: CreateLiquidateMSHLDto): Promise<MSHLTxHashData> {
    try{
      const createdLiquidateMSHL = new this.LiquidateMSHLModel({
        sender_bnb_address: createLiquidateXon20Dto.sender_bnb_address,
        receiver_xode_address: createLiquidateXon20Dto.receiver_xode_address,
        particulars: createLiquidateXon20Dto.particulars,
        amount_mshl: createLiquidateXon20Dto.amount_mshl,
        mshl_burned_txhash: createLiquidateXon20Dto.mshl_burned_txhash,
        status: createLiquidateXon20Dto.status,
      });
      return createdLiquidateMSHL.save();
    }catch(error:any){
      return error
    }
  }
  async liquidateMSHL(bnb_txhash: string): Promise<any> {
    return await this.GetMSHLTXHash(process.env.EXECUTE_REMITTANCE_API, bnb_txhash)
    .then( async (response:any) => {
      console.log(response)
      if(response==""){ 
        return new BadRequestException("No execute remittance records found");
      }else{
        let mshlData = {
          walletAddress: response.receiver_xode_address,
          balance: response.amount_mshl * 10 ** 12
        }
        const createLiquidateRecord = new this.LiquidateMSHLModel({
          sender_bnb_address: response.sender_bnb_address,
          receiver_xode_address: response.receiver_xode_address,
          particulars: response.particulars,
          amount_mshl: response.amount_mshl,
          mshl_burned_txhash: "",
          status: "New",
        });
        return await this.burnToken(mshlData, this.mshlContractAddress, this.mshlOwnerSeed)
        .then( async (response:any) => {
          createLiquidateRecord.mshl_burned_txhash = response.data.txhash;
          return await this.saveLiquidateMSHL(createLiquidateRecord)
          .then(savedRecord => {
            return savedRecord; // Or whatever you want to return
          })
          .catch((error) => {
            throw new Error(error);
          });
        }).catch((error) => {
          throw new Error(error);
        })
      }
    }).catch((error) => {
      throw new Error(error);
    })
  }

  async checkMUSDTBalance(account: string): Promise<any> {
    console.log('balanceOfRepo function was called');
    var api: any;
    try {
      await cryptoWaitReady();
      api = await InitializeAPI.apiInitialization();
      if (api instanceof Error) {
        return api;
      }
      const contractAddress = this.musdtContractAddress;
      const contract = await TXRepository.getContract(api, abi, contractAddress);
      if (!contract) {
        return Error('Contract not initialized.');
      }
      if (!contract.query || !contract.query.balanceOf) {
        return Error('balanceOf function not found in the contract ABI.');
      }
      const balance = await TXRepository.sendContractQuery(
        api,
        contract,
        'balanceOf',
        [ account ],
        this
      );
      const bigintbalance = BigInt(balance.ok);
      const balances = PolkadotUtility.balanceFormatter(
        6,
        bigintbalance
        );
      return { 
        balance: balances
      };
    } catch (error: any) {
      console.log('balanceOfRepo: ', error);
      return Error(error);
    } finally {
      if (!(api instanceof Error)) {
        await api.disconnect();
      }
    }
  }

  async checkMSHLBalance(account: string): Promise<any> {
    console.log('balanceOfRepo function was called');
    var api: any;
    try {
      await cryptoWaitReady();
      api = await InitializeAPI.apiInitialization();
      if (api instanceof Error) {
        return api;
      }
      const contractAddress = this.mshlContractAddress;
      const contract = await TXRepository.getContract(api, abi, contractAddress);
      if (!contract) {
        return Error('Contract not initialized.');
      }
      if (!contract.query || !contract.query.balanceOf) {
        return Error('balanceOf function not found in the contract ABI.');
      }
      const balance = await TXRepository.sendContractQuery(
        api,
        contract,
        'balanceOf',
        [ account ],
        this
      );
      const bigintbalance = BigInt(balance.ok);
      const balances = PolkadotUtility.balanceFormatter(
        6,
        bigintbalance
        );
      return { 
        balance: balances
      };
    } catch (error: any) {
      console.log('balanceOfRepo: ', error);
      return Error(error);
    } finally {
      if (!(api instanceof Error)) {
        await api.disconnect();
      }
    }
  }

  async checkMUSDTTotalSupply(): Promise<any> {
    console.log('totalSupplyRepo function was called');
    var api: any;
    try {
      await cryptoWaitReady();
      api = await InitializeAPI.apiInitialization();
      if (api instanceof Error) {
        return api;
      }
      const contractAddress = this.musdtContractAddress;
      const contract = await TXRepository.getContract(api, abi, contractAddress);
      if (!contract) {
        return Error('Contract not initialized.');
      }
      if (!contract.query || !contract.query.totalSupply) {
        return Error('totalSupply function not found in the contract ABI.');
      }
      const balance = await TXRepository.sendContractQuery(
        api,
        contract,
        'totalSupply',
        [],
        this
      );
      const bigintbalance = BigInt(balance.ok);
      const balances = PolkadotUtility.balanceFormatter(
        6,
        bigintbalance
        );
      return { 
        total_supply: balances
      };
    } catch (error: any) {
      console.log('totalSupplyRepo: ', error);
      return Error(error);
    } finally {
      if (!(api instanceof Error)) {
        await api.disconnect();
      }
    }
  }

  async checkMSHLTotalSupply(): Promise<any> {
    console.log('totalSupplyRepo function was called');
    var api: any;
    try {
      await cryptoWaitReady();
      api = await InitializeAPI.apiInitialization();
      if (api instanceof Error) {
        return api;
      }
      const contractAddress = this.mshlContractAddress;
      const contract = await TXRepository.getContract(api, abi, contractAddress);
      if (!contract) {
        return Error('Contract not initialized.');
      }
      if (!contract.query || !contract.query.totalSupply) {
        return Error('totalSupply function not found in the contract ABI.');
      }
      const balance = await TXRepository.sendContractQuery(
        api,
        contract,
        'totalSupply',
        [],
        this
      );
      const bigintbalance = BigInt(balance.ok);
      const balances = PolkadotUtility.balanceFormatter(
        6,
        bigintbalance
        );
      return { 
        total_supply: balances
      };
    } catch (error: any) {
      console.log('totalSupplyRepo: ', error);
      return Error(error);
    } finally {
      if (!(api instanceof Error)) {
        await api.disconnect();
      }
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} liquidateXon20`;
  }

  async bulkUpdate(musdt_burned_txhash: string[], updateData: UpdateLiquidateMUSDTDto) {
    try {

      const query = { musdt_burned_txhash: { $in: musdt_burned_txhash }, status: 'New' };

      const documents = await this.LiquidateMUSDTModel.find(query).exec();

      const idsToUpdate = documents.map(doc => doc._id);

      const result = await this.LiquidateMUSDTModel.updateMany(
        { _id: { $in: idsToUpdate } },
        {
          $set: {
            status: 'Reconciled',
            updateData,
            updated_at: new Date()
          }
        },
      ).exec();

      if (result.modifiedCount === 0) {
        return new BadRequestException("No Records Found")
      }
  
      return {
        message: 'Update successfully',
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
      };

    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async checkListOfBurnedMUSDT(status: string, date_start: Date, date_end: Date) {
    try {
      const startDate = new Date(date_start).toISOString();
      const endDate = new Date(date_end);
      endDate.setHours(23, 59, 59, 999);      
      // Query the database to find all matching documents
      const burnedMUSDTList = await this.LiquidateMUSDTModel.find({
        status: status,
        updated_at: {
          $gte: startDate,
          $lte: endDate,
        },
      }).exec();  
      // Return the list of burned MUSDT records
      return burnedMUSDTList;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async checkListOfBurnedMSHL(status: string, date_start: Date, date_end: Date) {
    try {
      const startDate = new Date(date_start).toISOString();
      const endDate = new Date(date_end);
      endDate.setHours(23, 59, 59, 999);      
      // Query the database to find all matching documents
      const burnedMSHLList = await this.LiquidateMSHLModel.find({
        status: status,
        updated_at: {
          $gte: startDate,
          $lte: endDate,
        },
      }).exec();  
      // Return the list of burned MUSDT records
      return burnedMSHLList;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  
  
}
