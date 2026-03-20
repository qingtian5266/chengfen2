import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectController } from './collect.controller';
import { CollectService } from './collect.service';
import { UserCollect } from './user-collect.entity';
import { Product } from '../product/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserCollect, Product])],
  controllers: [CollectController],
  providers: [CollectService],
})
export class CollectModule {}
