import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Product } from '../product/product.entity';
import { ComponentEntity } from '../component/component.entity';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ComponentEntity)
    private readonly componentRepository: Repository<ComponentEntity>,
  ) {}

  async suggest(keyword?: string) {
    const q = (keyword || '').trim();
    if (!q) {
      return [];
    }

    const [products, components] = await Promise.all([
      this.productRepository.find({
        select: ['name'],
        where: { name: Like(`%${q}%`) },
        take: 5,
      }),
      this.componentRepository.find({
        select: ['name'],
        where: { name: Like(`%${q}%`) },
        take: 5,
      }),
    ]);

    return Array.from(new Set([...products.map((item) => item.name), ...components.map((item) => item.name)]));
  }

  async query(keyword?: string) {
    const q = (keyword || '').trim();
    if (!q) {
      return {
        products: [],
        components: [],
      };
    }

    const [products, components] = await Promise.all([
      this.productRepository.find({
        where: [{ name: Like(`%${q}%`) }, { brand: Like(`%${q}%`) }, { barcode: Like(`%${q}%`) }],
        order: { created_at: 'DESC' },
        take: 30,
      }),
      this.componentRepository.find({
        where: { name: Like(`%${q}%`) },
        take: 30,
      }),
    ]);

    return {
      products,
      components,
    };
  }
}
