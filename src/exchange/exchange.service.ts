import {
  Injectable,
  InternalServerErrorException,
  Inject,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { EXCHANGE } from './exchange.mock';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable()
export class ExchangeService {
  private apiUrl: string;
  private apiKey: string;
  private exchange = EXCHANGE;

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiUrl = this.configService.get<string>('API_URL');
    this.apiKey = this.configService.get<string>('API_KEY');
  }

  async getExchangeRate() {
    const cacheKey = 'exchange_rate';
    const cachedItem = await this.cacheManager.get(cacheKey);

    if (cachedItem) {
      console.log('Cached exchange rate:', cachedItem);
      return cachedItem;
    }

    return this.httpService.get(`${this.apiUrl}${this.apiKey}`).pipe(
      map((response) => {
        const data = response.data;
        delete data.disclaimer;
        delete data.license;
        return data;
      }),
      tap((data) => {
        this.cacheManager.set(cacheKey, data, 8.64e7);
        console.log('Fetched exchange rate data:', data);
      }),
      catchError((error) => {
        console.error('API Request error', error);
        throw new InternalServerErrorException(
          'Error occurred while fetching exchange rate',
        );
      }),
    );
  }
}
