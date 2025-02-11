import { Controller, Get, Post, Put, Body, Patch, Param, Delete, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiCreatedResponse, ApiResponse } from '@nestjs/swagger';
import { RemittancesService } from './remittances.service';
import { CreateRemittanceDto } from './dto/create-remittance.dto';
import { USDTService } from 'src/usdt/usdt.service';
import * as dotenv from 'dotenv';

dotenv.config();

@ApiTags('Send Remittance')
@Controller('api/send-remittance')
export class RemittancesController {
  constructor(
    private readonly remittancesService: RemittancesService,
    private readonly usdtService: USDTService
  ) { }

  @Post('send')
  async send(@Body() createRemittanceDto: CreateRemittanceDto): Promise<any> {
    try {
      let new_remittance: CreateRemittanceDto = new CreateRemittanceDto();

      await this.usdtService.transfer(process.env.XODE_BINANCE_WALLET, createRemittanceDto.amount_usdt).then((data) => {
        let bnb_txhash = data;

        new_remittance = {
          sender: createRemittanceDto.sender,
          receiver: createRemittanceDto.receiver,
          particulars: createRemittanceDto.particulars,
          amount_usdt: createRemittanceDto.amount_usdt,
          amount_mshl: createRemittanceDto.amount_mshl,
          bnb_txhash: bnb_txhash
        }
      })

      return this.remittancesService.send(new_remittance);
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.toString() || 'Internal server error',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('list')
  async list(): Promise<any> {
    return await this.remittancesService.list();
  }

  @Get('list/:status')
  async listByStatus(@Param('status') status: string): Promise<any> {
    return await this.remittancesService.listByStatus(status);
  }

  @Get('check-usdt-balance/:address')
  async checkUSDTBalance(@Param('address') address: string): Promise<any> {
    let balance = 0;

    await this.usdtService.getBalance(address).then((value) => {
      balance = parseFloat(value);
    })

    return { "balance": balance };
  }

  @Put('/update-status/:bnb_txhash/:status')
  async updateStatus(
    @Param('bnb_txhash') bnb_txhash: string,
    @Param('status') status: string
  ): Promise<any> {
    try {
      return await this.remittancesService.updateStatus(bnb_txhash, status);
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.toString() || 'Internal server error',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
