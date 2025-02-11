import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Remittance } from './entities/remittance.entity';
import { CreateRemittanceDto } from './dto/create-remittance.dto';

@Injectable()
export class RemittancesService {
  constructor(
    @InjectModel(Remittance.name) private remittanceModel: Model<Remittance>
  ) { }

  async send(createRemittanceDto: CreateRemittanceDto): Promise<any> {
    const createdRemittance = new this.remittanceModel({
      sender: createRemittanceDto.sender,
      receiver: createRemittanceDto.receiver,
      particulars: createRemittanceDto.particulars,
      amount_usdt: createRemittanceDto.amount_usdt,
      amount_mshl: createRemittanceDto.amount_mshl,
      bnb_txhash: createRemittanceDto.bnb_txhash,
      status: "New",
    });

    return createdRemittance.save();
  }

  async list(): Promise<any> {
    return this.remittanceModel.find().exec();
  }

  async listByStatus(status: string): Promise<any> {
    return this.remittanceModel.find({ status: status }).exec();
  }

  async updateStatus(bnb_txhash: string, status: string): Promise<any> {
    const existingRemittance = this.remittanceModel
      .findOneAndUpdate({ bnb_txhash: bnb_txhash }, { status: status }, { new: true })
      .exec();

    if (!existingRemittance) {
      return null;
    }

    return existingRemittance;
  }

  async remove(id: string): Promise<any> {
    return this.remittanceModel.findByIdAndDelete(id).exec();
  }
}
