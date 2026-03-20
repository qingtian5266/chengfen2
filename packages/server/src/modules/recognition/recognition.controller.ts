import { Body, Controller, Post } from '@nestjs/common';
import { RecognitionService } from './recognition.service';

@Controller('recognition')
export class RecognitionController {
  constructor(private readonly recognitionService: RecognitionService) {}

  @Post('ocr')
  async ocr(@Body() dto: { imageUrl?: string; base64?: string; mockText?: string }) {
    return this.recognitionService.ocr(dto);
  }
}
