import { Injectable } from '@nestjs/common';

@Injectable()
export class RecognitionService {
  async ocr(dto: { imageUrl?: string; base64?: string; mockText?: string }) {
    const text = (dto.mockText || '').trim();

    const components = text
      ? text
          .split(/[，,、\n\s]+/)
          .map((item) => item.trim())
          .filter(Boolean)
          .slice(0, 30)
      : ['水', '甘油', '丙二醇', '香精'];

    return {
      imageUrl: dto.imageUrl || '',
      components: components.map((name) => ({
        name,
        confidence: 0.85,
      })),
      provider: 'mock',
    };
  }
}
