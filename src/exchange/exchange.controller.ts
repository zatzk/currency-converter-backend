import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ExchangeService } from './exchange.service';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

@Controller('exchange')
@UseInterceptors(CacheInterceptor)
export class ExchangeController {
  constructor(private readonly exchangeService: ExchangeService) {}

  @Get()
  @CacheTTL(50000)
  getExchangeRate() {
    return this.exchangeService.getExchangeRate();
  }
}
