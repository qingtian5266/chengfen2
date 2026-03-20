import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    // 检查是否标记为 @Public()，如果是则跳过认证
    const isPublic = Reflect.getOwnMetadata(IS_PUBLIC_KEY, context.getHandler());
    if (isPublic) {
      return true;
    }

    const token = this.extractTokenFromRequest(request);
    if (!token) {
      throw new UnauthorizedException('Token 缺失');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_SECRET'),
      });
      console.log('Token payload:', payload);
      request['user'] = payload;
    } catch (error) {
      console.error('Token 验证失败:', error);
      throw new UnauthorizedException('Token 无效或已过期');
    }

    return true;
  }

  private extractTokenFromRequest(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }
    return undefined;
  }
}
