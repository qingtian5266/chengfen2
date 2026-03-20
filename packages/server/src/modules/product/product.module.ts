import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Product } from './product.entity';
import { ProductComponent } from './product-component.entity';
import { ComponentEntity } from '../component/component.entity';
import { UserCollect } from '../collect/user-collect.entity';
import { UserHistory } from '../history/user-history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductComponent,
      ComponentEntity,
      UserCollect,
      UserHistory,
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
