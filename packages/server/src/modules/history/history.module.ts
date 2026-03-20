import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoryController } from './history.controller';
import { HistoryService } from './history.service';
import { UserHistory } from './user-history.entity';
import { Product } from '../product/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserHistory, Product])],
  controllers: [HistoryController],
  providers: [HistoryService],
})
export class HistoryModule {}
