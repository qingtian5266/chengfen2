import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { WechatService, WechatLoginDto } from './wechat.service';
import { JwtGuard } from '../../common/guards/jwt.guard';

@Controller('wechat')
export class WechatController {
  constructor(private wechatService: WechatService) {}

  /**
   * 微信登录
   * @param dto - 包含微信授权 code
   */
  @Post('login')
  async login(@Body() dto: WechatLoginDto) {
    return this.wechatService.login(dto);
  }

  /**
   * 获取微信用户列表（需要 JWT 认证）
   */
  @Post('list')
  @UseGuards(JwtGuard)
  async list(@Body() dto: { page?: number; pageSize?: number; keyword?: string }) {
    return this.wechatService.list(dto);
  }

  /**
   * 获取微信用户详情（需要 JWT 认证）
   */
  @Post('detail')
  @UseGuards(JwtGuard)
  async detail(@Body() dto: { id: number }) {
    return this.wechatService.detail(dto.id);
  }

  /**
   * 通过 openid 获取用户详情（需要 JWT 认证）
   */
  @Post('detail-by-openid')
  @UseGuards(JwtGuard)
  async detailByOpenid(@Body() dto: { openid: string }) {
    return this.wechatService.detailByOpenid(dto.openid);
  }
}
