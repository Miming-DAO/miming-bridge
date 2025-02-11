import { Controller, Get, Put } from '@nestjs/common';
import { SendRemittanceService } from './send-remittance.service';
import { ApiTags } from '@nestjs/swagger';
import { SendRemittance } from './schemas/send-remittance.schema';

@ApiTags('send-remittance')
@Controller('send-remittance')
export class SendRemittanceController {

    constructor(
        private sendRemittanceService: SendRemittanceService
    ){
    }

    // @Get()
    // getRemittance():Promise<SendRemittance[]>{
    //     return this.sendRemittanceService.getRemittance();
    //     // return true;
    // }
    // @Get('all')
    // verify(){
    //   return this.sendRemittanceService.verifySentRemittance('0xc4156f9d1f9ef25cdd4de8ca1ec2bbe617dd193565b9254490fb7a6cec11e24e');
    // }

    @Get()
    update(){
        return this.sendRemittanceService.updateSendRemittance('0xc4156f9d1f9ef25cdd4de8ca1ec2bbe617dd193565b9254490fb7a6cec11e24e','NEW');
    }
}
