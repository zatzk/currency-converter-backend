import {
  Injectable,
  InternalServerErrorException,
  Inject,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { catchError, map, tap } from 'rxjs/operators';
import { currencyDictionary } from './currencyDictionary';

@Injectable()
export class ExchangeService {
  private apiUrl: string;
  private apiKey: string;

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

        for (const key in data.rates) {
          if (currencyDictionary[key]) {
            data.rates[key] = {
              name: currencyDictionary[key].name,
              rate: data.rates[key],
              flag: currencyDictionary[key].flag,
              symbol: currencyDictionary[key].symbol,
              emoji: currencyDictionary[key].emoji,
            };
          }
        }
        console.log('Fetched exchange rate data:', data);
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
