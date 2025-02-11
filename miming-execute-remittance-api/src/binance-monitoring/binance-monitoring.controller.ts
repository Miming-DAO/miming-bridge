import { Controller, Get } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { BinanceMonitoringService } from './binance-monitoring.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('binance-monitoring')
@Controller('binance-monitoring')
export class BinanceMonitoringController {
    private readonly logger = new Logger(BinanceMonitoringController.name);
    
    constructor(
        private readonly httpService: HttpService,
        private binanceMonitoringService: BinanceMonitoringService,
    ) {
    }

    @Get('all')
    verify(){
      return this.binanceMonitoringService.getBinanceTx('0xc4156f9d1f9ef25cdd4de8ca1ec2bbe617dd193565b9254490fb7a6cec11e24e');
    }
    
    // @Cron('1 * * * * *',{
    //     name: 'get-unsent-remittance',
    // })
    // getUnsentRemittanceCron() {
    // }

    // @Cron('20 * * * * *',{
    //     name: 'verify-remittance',
    // })
    // verifyCron() {
    // }
}
