import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { Product } from '../product/product.entity';
import { ComponentEntity } from '../component/component.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ComponentEntity])],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
