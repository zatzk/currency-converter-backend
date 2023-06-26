import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { EXCHANGE } from './exchange.mock';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class ExchangeService {
  private apiUrl: string;
  private apiKey: string;
  private exchange = EXCHANGE;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiUrl = this.configService.get<string>('API_URL');
    this.apiKey = this.configService.get<string>('API_KEY');
  }

  getExchangeRate() {
    return this.httpService.get(`${this.apiUrl}${this.apiKey}`).pipe(
      map((response) => response.data), // Extract the data from the response
      catchError((error) => {
        console.error('API Request error', error);
        throw new InternalServerErrorException(
          'Error occurred while fetching exchange rate',
        );
      }),
    );
  }
}
