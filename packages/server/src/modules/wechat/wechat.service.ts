import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WechatUser } from './wechat-user.entity';
import * as axios from 'axios';

export interface WechatLoginDto {
  code: string; // 微信授权 code
}

export interface WechatUserInfoDto {
  openid: string;
  nickname?: string;
  sex?: number;
  province?: string;
  city?: string;
  country?: string;
  headimgurl?: string;
  phone?: string;
}

@Injectable()
export class WechatService {
  private readonly wechatAppId: string;
  private readonly wechatAppSecret: string;

  constructor(
    @InjectRepository(WechatUser)
    private wechatUserRepository: Repository<WechatUser>,
    private jwtService: JwtService,
  ) {
    this.wechatAppId = process.env.WECHAT_APP_ID || '';
    this.wechatAppSecret = process.env.WECHAT_APP_SECRET || '';
  }

  /**
   * 微信登录 - 通过 code 换取用户信息
   */
  async login(dto: WechatLoginDto) {
    // 1. 通过 code 换取 access_token 和 openid
    const tokenUrl = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${this.wechatAppId}&secret=${this.wechatAppSecret}&code=${dto.code}&grant_type=authorization_code`;
    
    const tokenResponse = await axios.default.get(tokenUrl);
    const tokenData = tokenResponse.data;

    if (tokenData.errcode) {
      throw new UnauthorizedException(`微信登录失败：${tokenData.errmsg}`);
    }

    const { openid, access_token, refresh_token, expires_in, scope } = tokenData;

    // 2. 获取用户信息
    const userInfoUrl = `https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}&lang=zh_CN`;
    const userInfoResponse = await axios.default.get(userInfoUrl);
    const userInfo = userInfoResponse.data;

    if (userInfo.errcode) {
      throw new UnauthorizedException(`获取用户信息失败：${userInfo.errmsg}`);
    }

    // 3. 查找或创建用户
    let wechatUser = await this.wechatUserRepository.findOne({
      where: { openid },
    });

    if (wechatUser) {
      // 更新用户信息
      wechatUser.nickname = userInfo.nickname;
      wechatUser.avatar = userInfo.headimgurl;
      wechatUser.sex = userInfo.sex;
      wechatUser.province = userInfo.province;
      wechatUser.city = userInfo.city;
      wechatUser.country = userInfo.country;
      wechatUser.access_token = access_token;
      wechatUser.refresh_token = refresh_token;
      wechatUser.token_expires_at = Math.floor(Date.now() / 1000) + expires_in;
      wechatUser.scope = scope;
      wechatUser.last_login_at = new Date();
      
      await this.wechatUserRepository.save(wechatUser);
    } else {
      // 创建新用户
      wechatUser = this.wechatUserRepository.create({
        openid,
        unionid: userInfo.unionid,
        nickname: userInfo.nickname,
        sex: userInfo.sex,
        province: userInfo.province,
        city: userInfo.city,
        country: userInfo.country,
        avatar: userInfo.headimgurl,
        access_token,
        refresh_token,
        token_expires_at: Math.floor(Date.now() / 1000) + expires_in,
        scope,
        role: 'user',
        status: 1,
        last_login_at: new Date(),
      });

      await this.wechatUserRepository.save(wechatUser);
    }

    // 4. 生成 JWT token
    const token = await this.generateToken(wechatUser);

    return {
      token,
      user: {
        id: wechatUser.id,
        openid: wechatUser.openid,
        nickname: wechatUser.nickname,
        avatar: wechatUser.avatar,
        sex: wechatUser.sex,
        phone: wechatUser.phone,
        role: wechatUser.role,
      },
    };
  }

  /**
   * 获取微信用户列表（返回全部数据，无分页）
   */
  async list() {
    const users = await this.wechatUserRepository.find({
      where: { status: 1 },
      order: { created_at: 'DESC' },
    });

    return users.map(user => ({
      id: user.id,
      openid: user.openid,
      unionid: user.unionid,
      nickname: user.nickname,
      sex: user.sex,
      province: user.province,
      city: user.city,
      country: user.country,
      avatar: user.avatar,
      phone: user.phone,
      role: user.role,
      status: user.status,
      last_login_at: user.last_login_at,
      created_at: user.created_at,
      updated_at: user.updated_at,
    }));
  }

  /**
   * 获取微信用户详情
   */
  async detail(id: number) {
    const user = await this.wechatUserRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }

    return {
      id: user.id,
      openid: user.openid,
      unionid: user.unionid,
      nickname: user.nickname,
      sex: user.sex,
      province: user.province,
      city: user.city,
      country: user.country,
      avatar: user.avatar,
      phone: user.phone,
      role: user.role,
      status: user.status,
      last_login_at: user.last_login_at,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }

  /**
   * 通过 openid 获取用户详情
   */
  async detailByOpenid(openid: string) {
    const user = await this.wechatUserRepository.findOne({
      where: { openid },
    });

    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }

    return {
      id: user.id,
      openid: user.openid,
      unionid: user.unionid,
      nickname: user.nickname,
      sex: user.sex,
      province: user.province,
      city: user.city,
      country: user.country,
      avatar: user.avatar,
      phone: user.phone,
      role: user.role,
      status: user.status,
      last_login_at: user.last_login_at,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }

  /**
   * 删除微信用户（软删除）
   */
  async delete(id: number) {
    const user = await this.wechatUserRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }

    user.status = 0;
    await this.wechatUserRepository.save(user);

    return { success: true };
  }

  private async generateToken(user: WechatUser): Promise<string> {
    return this.jwtService.signAsync({
      sub: user.id,
      openid: user.openid,
      role: user.role,
    });
  }
}
