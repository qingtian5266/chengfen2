import { Body, Controller, Post } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Post('suggest')
  async suggest(@Body() dto: { keyword?: string }) {
    return this.searchService.suggest(dto.keyword);
  }

  @Post('query')
  async query(@Body() dto: { keyword?: string }) {
    return this.searchService.query(dto.keyword);
  }
}
