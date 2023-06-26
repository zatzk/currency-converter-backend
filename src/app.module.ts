import { Module } from '@nestjs/common';
import { ExchangeController } from './exchange/exchange.controller';
import { HttpModule } from '@nestjs/axios';
import { ExchangeService } from './exchange/exchange.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), HttpModule],
  controllers: [ExchangeController],
  providers: [ExchangeService],
})
export class AppModule {}
