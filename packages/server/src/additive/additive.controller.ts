import { Controller, Post, Body } from '@nestjs/common';
import { AdditiveService } from './additive.service';
import { CreateAdditiveDto, UpdateAdditiveDto } from './dto/additive.dto';
import { Public } from '../common/decorators/public.decorator';

@Controller('additive')
export class AdditiveController {
  constructor(private additiveService: AdditiveService) {}

  @Public()
  @Post('list')
  async list() {
    return this.additiveService.list();
  }

  @Public()
  @Post('create')
  async create(@Body() dto: CreateAdditiveDto) {
    return this.additiveService.create(dto);
  }

  @Public()
  @Post('update')
  async update(@Body() dto: UpdateAdditiveDto) {
    return this.additiveService.update(dto);
  }

  @Public()
  @Post('delete')
  async delete(@Body() dto: { id: number }) {
    return this.additiveService.delete(dto.id);
  }
}
