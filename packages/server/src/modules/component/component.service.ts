import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ComponentEntity } from './component.entity';

@Injectable()
export class ComponentService {
  constructor(
    @InjectRepository(ComponentEntity)
    private readonly componentRepository: Repository<ComponentEntity>,
  ) {}

  async detail(dto: { id?: number; name?: string }) {
    const { id, name } = dto;
    const component = id
      ? await this.componentRepository.findOne({ where: { id } })
      : await this.componentRepository.findOne({ where: { name: (name || '').trim() } });

    if (!component) {
      throw new NotFoundException('成分不存在');
    }

    return component;
  }
}
