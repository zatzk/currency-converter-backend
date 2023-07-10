/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ExchangeController } from './exchange/exchange.controller';
import { HttpModule } from '@nestjs/axios';
import { ExchangeService } from './exchange/exchange.service';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [ConfigModule.forRoot(), 
    HttpModule,
    CacheModule.register()
    ],
  controllers: [ExchangeController],
  providers: [ExchangeService],
})
export class AppModule {}
