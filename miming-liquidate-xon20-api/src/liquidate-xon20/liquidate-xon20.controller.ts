import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query } from '@nestjs/common';
import { LiquidateXon20Service } from './liquidate-xon20.service';
import { CreateLiquidateMUSDTDto } from './dto/create-liquidate-musdt.dto';
import { UpdateLiquidateMUSDTDto } from './dto/update-liquidate-musdt.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Liquidate XON20')
@Controller('liquidate-xon20')
export class LiquidateXon20Controller {
  constructor(private readonly liquidateXon20Service: LiquidateXon20Service) { }

  @Post('liquidate-musdt/:bnb_txhash')
  async liquidateMUSDT(@Param('bnb_txhash') bnb_txhash: string) {
    return this.liquidateXon20Service.liquidateMUSDT(bnb_txhash);
  }
  
  @Post('liquidate-mshl/:bnb_txhash')
  async liquidateMSHL(@Param('bnb_txhash') bnb_txhash: string) {
    return this.liquidateXon20Service.liquidateMSHL(bnb_txhash);
  }

  @Put('bulk/update-statuses/reconciled')
  async bulkUpdate(
  @Query('musdt_burned_txhash') musdt_burned_txhash: string[],
  @Body('updateData') updateData: UpdateLiquidateMUSDTDto,
  ) {
  if (updateData && updateData.status === 'New') {
    updateData.status = 'Reconciled';
  }
  return await this.liquidateXon20Service.bulkUpdate(musdt_burned_txhash, updateData);
  }

  // @Get('unreconciled/total-musdt-balance')
  // async totalMUSDTBalance(): Promise<any> {
  //   return this.liquidateXon20Service.totalMUSDTBalance();
  // }

  @Get('check-musdt-balance/:address')
  async checkMUSDTBalance(@Param('address') address: string): Promise<any> {
    return this.liquidateXon20Service.checkMUSDTBalance(address);
  }

  @Get('check-mshl-balance/:address')
  async checkMSHLBalance(@Param('address') address: string): Promise<any> {
    return this.liquidateXon20Service.checkMSHLBalance(address);
  }

  @Get('musdt-total-supply')
  async checkMUSDTTotalSupply(): Promise<any> {
    return this.liquidateXon20Service.checkMUSDTTotalSupply();
  }

  @Get('mshl-total-supply')
  async checkMSHLTotalSupply(): Promise<any> {
    return this.liquidateXon20Service.checkMSHLTotalSupply();
  }

  @Get('/list-burned-musdt/:status/:date_start/:date_end')
  async checkListOfBurnedMUSDT(
    @Param('status') status: string,
    @Param('date_start') date_start: Date,
    @Param('date_end') date_end: Date,
  ): Promise<any> {
    return this.liquidateXon20Service.checkListOfBurnedMUSDT(status,date_start,date_end);
  }

  @Get('/list-burned-mshl/:status/:date_start/:date_end')
  async checkListOfBurnedMSHL(
    @Param('status') status: string,
    @Param('date_start') date_start: Date,
    @Param('date_end') date_end: Date,
  ): Promise<any> {
    return this.liquidateXon20Service.checkListOfBurnedMSHL(status,date_start,date_end);
  }


}
