import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import axios from 'axios';
import { User } from '../modules/users/user.entity';
import { WechatUser } from '../modules/wechat/wechat-user.entity';

export interface RegisterDto {
  username: string;
  password: string;
  email?: string;
  phone?: string;
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface WechatLoginDto {
  code: string;
  nickname?: string;
  avatar?: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(WechatUser)
    private wechatUserRepository: Repository<WechatUser>,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.userRepository.findOne({
      where: { username: dto.username },
    });

    if (existing) {
      throw new ConflictException('用户名已存在');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    const user = this.userRepository.create({
      username: dto.username,
      password: passwordHash,
      email: dto.email,
      phone: dto.phone,
      role: 'user',
      status: 1,
    });

    await this.userRepository.save(user);

    const token = await this.generateToken(user);

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
      },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { username: dto.username },
    });

    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    const isValid = await bcrypt.compare(dto.password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    if (user.status === 0) {
      throw new UnauthorizedException('账号已被禁用');
    }

    const token = await this.generateToken(user);

    // 返回格式：{token, info: {id, username}}
    return {
      token,
      info: {
        id: user.id,
        username: user.username,
      },
    };
  }

  async wechatLogin(dto: WechatLoginDto) {
    const code = (dto.code || '').trim();
    if (!code) {
      throw new BadRequestException('code不能为空');
    }

    const openid = await this.resolveMiniOpenid(code);
    const now = new Date();

    let user = await this.wechatUserRepository.findOne({ where: { openid } });
    if (!user) {
      user = this.wechatUserRepository.create({
        openid,
        nickname: dto.nickname || `微信用户${openid.slice(-6)}`,
        avatar: dto.avatar || '',
        role: 'user',
        status: 1,
        last_login_at: now,
      });
    } else {
      user.nickname = dto.nickname || user.nickname;
      user.avatar = dto.avatar || user.avatar;
      user.last_login_at = now;
      user.status = 1;
    }

    await this.wechatUserRepository.save(user);

    const token = await this.jwtService.signAsync({
      sub: user.id,
      openid: user.openid,
      role: user.role,
    });

    return {
      token,
      user: {
        id: user.id,
        openid: user.openid,
        nickname: user.nickname,
        avatar: user.avatar,
        role: user.role,
      },
    };
  }

  private async resolveMiniOpenid(code: string): Promise<string> {
    const appid = process.env.WECHAT_APP_ID || '';
    const secret = process.env.WECHAT_APP_SECRET || '';

    if (!appid || !secret || code.startsWith('mock_')) {
      return `mock_openid_${code.replace(/[^a-zA-Z0-9]/g, '').slice(0, 30)}`;
    }

    const url = 'https://api.weixin.qq.com/sns/jscode2session';
    const response = await axios.get(url, {
      params: {
        appid,
        secret,
        js_code: code,
        grant_type: 'authorization_code',
      },
    });

    const data = response.data as any;
    if (!data || data.errcode || !data.openid) {
      throw new UnauthorizedException(`微信登录失败：${data?.errmsg || '未知错误'}`);
    }

    return data.openid;
  }

  private async generateToken(user: User): Promise<string> {
    return this.jwtService.signAsync({
      sub: user.id,
      username: user.username,
      role: user.role,
    });
  }
}
