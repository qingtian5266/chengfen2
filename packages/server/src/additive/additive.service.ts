import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Additive } from './additive.entity';
import { CreateAdditiveDto, UpdateAdditiveDto } from './dto/additive.dto';

@Injectable()
export class AdditiveService {
  constructor(
    @InjectRepository(Additive)
    private additiveRepository: Repository<Additive>,
  ) {}

  async list(): Promise<Additive[]> {
    return this.additiveRepository.find({
      order: { created_at: 'DESC' },
    });
  }

  async create(dto: CreateAdditiveDto): Promise<Additive> {
    console.log(555, dto);
    // 检查中文名称是否已存在
    const existing = await this.additiveRepository.findOne({
      where: { nameCn: dto.nameCn },
    });

    if (existing) {
      throw new ConflictException('中文名称已存在');
    }

    console.log(555, dto);

    const additive = this.additiveRepository.create(dto);
    await this.additiveRepository.save(additive);
    return additive;
  }

  async update(dto: UpdateAdditiveDto): Promise<Additive> {
    const additive = await this.additiveRepository.findOne({ where: { id: dto.id } });
    if (!additive) {
      throw new NotFoundException('添加剂不存在');
    }

    // 检查中文名称是否与其他记录重复
    const existing = await this.additiveRepository.findOne({
      where: { nameCn: dto.nameCn },
    });

    if (existing && existing.id !== dto.id) {
      throw new ConflictException('中文名称已存在');
    }

    Object.assign(additive, dto);
    await this.additiveRepository.save(additive);
    return additive;
  }

  async delete(id: number): Promise<{ success: boolean }> {
    const additive = await this.additiveRepository.findOne({ where: { id } });
    if (!additive) {
      throw new NotFoundException('添加剂不存在');
    }
    await this.additiveRepository.remove(additive);
    return { success: true };
  }
}
