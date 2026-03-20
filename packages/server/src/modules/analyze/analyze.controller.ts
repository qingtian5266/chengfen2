import { Body, Controller, Post } from '@nestjs/common';
import { AnalyzeService } from './analyze.service';

@Controller('analyze')
export class AnalyzeController {
  constructor(private readonly analyzeService: AnalyzeService) {}

  @Post('components')
  async analyzeComponents(@Body() dto: { category?: string; components: string[] }) {
    return this.analyzeService.analyzeComponents(dto);
  }
}
