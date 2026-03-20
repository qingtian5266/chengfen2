import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { WechatController } from './wechat.controller';
import { WechatService } from './wechat.service';
import { WechatUser } from './wechat-user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([WechatUser]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [WechatController],
  providers: [WechatService],
  exports: [WechatService],
})
export class WechatModule {}
