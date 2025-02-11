import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { ExecuteRemittanceService } from './execute-remittance.service';
import { ExecuteRemittance } from './schemas/execute-remittance.schema';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('execute-remittance')
@Controller('execute-remittance')
export class ExecuteRemittanceController {
  constructor(private readonly executeRemittanceService: ExecuteRemittanceService) {}

  @Post()
  create(@Body() executeRemittance): Promise<ExecuteRemittance> {
    return this.executeRemittanceService.create(executeRemittance);
  }

  @Get('list/:status')
  findAllByStatus( 
    @Param('status') status: string
  ): Promise<ExecuteRemittance[]> {
    return this.executeRemittanceService.findAllByStatus(status);
  }

  @Get('get-musdt-info/:bnb_txhash')
  findOneByMUSDTTxHash( 
    @Param('bnb_txhash') bnb_txhash: string 
  ): Promise<ExecuteRemittance> {
    return this.executeRemittanceService.getMintInfoByBNBTxHash(bnb_txhash);
  }

  @Get('get-mshl-info/:bnb_txhash')
  findOneByMSHLTxHash( 
    @Param('bnb_txhash') bnb_txhash: string 
  ): Promise<ExecuteRemittance> {
    return this.executeRemittanceService.getMintInfoByBNBTxHash(bnb_txhash);
  }

  @Put('update-status/:musdt_txhash/:status')
  update( 
    @Param('musdt_txhash') musdt_txhash: string, 
    @Param('status') status: string, 
  ): Promise<ExecuteRemittance> {
    return this.executeRemittanceService.update(musdt_txhash, status);
  }
}
