import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { ExecuteRemittance } from './schemas/execute-remittance.schema';

@Injectable()
export class ExecuteRemittanceService {

  constructor(
    @InjectModel(ExecuteRemittance.name)
    private executeRemittanceModel: mongoose.Model<ExecuteRemittance>
  ){}


  async findAllByStatus(status: string): Promise<ExecuteRemittance[]>{
    const executeRemittances = await this.executeRemittanceModel.find({status: status}).exec();
    return executeRemittances;
  }

  async getMintInfoByBNBTxHash(bnb_txhash: string) : Promise<ExecuteRemittance> {
    const executeRemittances = await this.executeRemittanceModel.findOne({bnb_txhash: bnb_txhash}).exec();
    return executeRemittances;
  }

  async create(executeRemittance: ExecuteRemittance): Promise<ExecuteRemittance> {
    const res = await this.executeRemittanceModel.create(executeRemittance);
    return res;
  }

  async update(bnb_txhash: string, status: string): Promise<ExecuteRemittance> {
    const updateExecuteRemittance 
      = await this.executeRemittanceModel.findOneAndUpdate(
          {bnb_txhash: bnb_txhash}, 
          {$set: {status: status}}, 
          { new: true }).exec();
    return updateExecuteRemittance;
  }

  // remove(id: number) {
  //   return `This action removes a #${id} executeRemittance`;
  // }
}
