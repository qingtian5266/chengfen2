import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { UserHistory } from './user-history.entity';
import { Product } from '../product/product.entity';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(UserHistory)
    private readonly historyRepository: Repository<UserHistory>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async list(openid: string, page = 1, pageSize = 20) {
    const skip = (page - 1) * pageSize;
    const [rows, total] = await this.historyRepository.findAndCount({
      where: { openid },
      order: { updated_at: 'DESC' },
      skip,
      take: pageSize,
    });

    const productIds = rows.map((item) => item.product_id);
    const products = productIds.length
      ? await this.productRepository.find({ where: { id: In(productIds) } })
      : [];
    const productMap = new Map(products.map((item) => [item.id, item]));

    return {
      list: rows
        .map((row) => ({
          id: row.id,
          product: productMap.get(row.product_id) || null,
          created_at: row.created_at,
          updated_at: row.updated_at,
        }))
        .filter((item) => item.product),
      total,
      page,
      pageSize,
    };
  }

  async delete(openid: string, id: number) {
    await this.historyRepository.delete({ openid, id });
    return { success: true };
  }

  async clear(openid: string) {
    await this.historyRepository.delete({ openid });
    return { success: true };
  }
}
