import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron, Interval } from '@nestjs/schedule';
import { SendRemittanceService } from './send-remittance.service';

@Injectable()
export class SomeService implements OnModuleInit {
    constructor(
        private sendRemittanceService: SendRemittanceService
    ){}
    
    @Cron('10 * * * * *', {
        name: 'get-sent-remittance',
        // timeZone: 'Europe/Paris',
    })
    getSentRemittance() {
        console.log('Starting cron job getSentRemittance...');
        this.sendRemittanceService.getRemittance();
    }


    // @Interval(1000)
    @Cron('30 * * * * *', {
        name: 'execute-remittance',
        // timeZone: 'Europe/Paris',
    })
    verifyRemittance() {
        console.log('Starting cron job verifyRemittance...');
        this.sendRemittanceService.verifyRemitance();
    }

//   // Automatically trigger the cron job when the module is initialized
    onModuleInit() {
    // this.handleCron();  // Automatically start the cron job logic
    }
}