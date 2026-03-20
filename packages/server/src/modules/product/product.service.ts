import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Product } from './product.entity';
import { ProductComponent } from './product-component.entity';
import { ComponentEntity } from '../component/component.entity';
import { UserCollect } from '../collect/user-collect.entity';
import { UserHistory } from '../history/user-history.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductComponent)
    private readonly productComponentRepository: Repository<ProductComponent>,
    @InjectRepository(ComponentEntity)
    private readonly componentRepository: Repository<ComponentEntity>,
    @InjectRepository(UserCollect)
    private readonly collectRepository: Repository<UserCollect>,
    @InjectRepository(UserHistory)
    private readonly historyRepository: Repository<UserHistory>,
  ) {}

  async byBarcode(barcode: string) {
    const code = (barcode || '').trim();
    if (!code) {
      return null;
    }

    const product = await this.productRepository.findOne({ where: { barcode: code } });
    if (!product) {
      return null;
    }

    return {
      id: product.id,
      name: product.name,
      brand: product.brand,
      barcode: product.barcode,
      category: product.category,
      risk_level: product.risk_level,
    };
  }

  async detail(id: number, openid?: string) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('产品不存在');
    }

    const links = await this.productComponentRepository.find({
      where: { product_id: id },
      order: { sort_order: 'ASC' },
    });

    const componentIds = links.map((item) => item.component_id);
    const components = componentIds.length
      ? await this.componentRepository.find({ where: { id: In(componentIds) } })
      : [];

    const componentMap = new Map(components.map((item) => [item.id, item]));
    const orderedComponents = links
      .map((item) => componentMap.get(item.component_id))
      .filter(Boolean)
      .map((item) => ({
        id: item.id,
        name: item.name,
        risk_level: item.risk_level,
        description: item.description,
      }));

    let isCollected = false;
    if (openid) {
      const collect = await this.collectRepository.findOne({ where: { openid, product_id: id } });
      isCollected = Boolean(collect);
      await this.recordHistory(openid, id);
    }

    return {
      ...product,
      components: orderedComponents,
      isCollected,
    };
  }

  private async recordHistory(openid: string, productId: number) {
    const existing = await this.historyRepository.findOne({
      where: { openid, product_id: productId },
    });

    if (existing) {
      existing.updated_at = new Date();
      await this.historyRepository.save(existing);
      return;
    }

    const history = this.historyRepository.create({
      openid,
      product_id: productId,
    });
    await this.historyRepository.save(history);
  }
}
