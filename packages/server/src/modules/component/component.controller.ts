import { Body, Controller, Post } from '@nestjs/common';
import { ComponentService } from './component.service';

@Controller('component')
export class ComponentController {
  constructor(private readonly componentService: ComponentService) {}

  @Post('detail')
  async detail(@Body() dto: { id?: number; name?: string }) {
    return this.componentService.detail(dto);
  }
}
