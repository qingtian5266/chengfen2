import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { UserCollect } from './user-collect.entity';
import { Product } from '../product/product.entity';

@Injectable()
export class CollectService {
  constructor(
    @InjectRepository(UserCollect)
    private readonly collectRepository: Repository<UserCollect>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(openid: string, productId: number) {
    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException('产品不存在');
    }

    const existing = await this.collectRepository.findOne({
      where: { openid, product_id: productId },
    });

    if (existing) {
      return { success: true, collected: true };
    }

    const record = this.collectRepository.create({
      openid,
      product_id: productId,
    });
    await this.collectRepository.save(record);

    return { success: true, collected: true };
  }

  async cancel(openid: string, productId: number) {
    await this.collectRepository.delete({
      openid,
      product_id: productId,
    });

    return { success: true, collected: false };
  }

  async list(openid: string, page = 1, pageSize = 20) {
    const skip = (page - 1) * pageSize;
    const [rows, total] = await this.collectRepository.findAndCount({
      where: { openid },
      order: { created_at: 'DESC' },
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
        }))
        .filter((item) => item.product),
      total,
      page,
      pageSize,
    };
  }
}
