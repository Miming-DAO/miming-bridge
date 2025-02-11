import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
@Injectable()
export class BinanceMonitoringService {
    private readonly logger = new Logger(BinanceMonitoringService.name);
    
    constructor(private readonly httpService: HttpService) {
    }

    async getBinanceTx(txhash:string): Promise<any> {
        try{
            const { data } = await firstValueFrom(
                this.httpService.get<String>(process.env.BNB_URL
                    + '?module=transaction'
                    + '&action=gettxreceiptstatus'
                    + '&txhash=' + txhash
                    + '&apikey=' + process.env.API_KEY
                )
                .pipe(
                        catchError((error: AxiosError) => {
                        this.logger.error(error.response.data);
                        throw 'An error happened!';
                    }),
                ),
            );
            console.log(data)
            return data;
        }
        catch(error){
            console.log(error)
        }
    }
}
