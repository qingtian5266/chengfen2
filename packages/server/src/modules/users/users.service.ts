import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

export interface UserListDto {
  page: number;
  size: number;
  username?: string;
  status?: number;
}

export interface CreateUserDto {
  username: string;
  password: string;
  email?: string;
  phone?: string;
  role?: string;
  avatar?: string;
}

export interface UpdateUserDto {
  id: number;
  username?: string;
  email?: string;
  phone?: string;
  status?: number;
  role?: string;
  avatar?: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async list(dto: UserListDto) {
    const { page = 1, size = 10, username, status } = dto;
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if (username) {
      queryBuilder.andWhere('user.username LIKE :username', {
        username: `%${username}%`,
      });
    }

    if (status !== undefined) {
      queryBuilder.andWhere('user.status = :status', { status });
    }

    queryBuilder
      .orderBy('user.created_at', 'DESC')
      .skip((page - 1) * size)
      .take(size);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      list: data.map((user) => this.hidePassword(user)),
      total,
      page,
      size,
    };
  }

  async detail(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    return this.hidePassword(user);
  }

  async create(dto: CreateUserDto) {
    console.log(dto);
    // 检查用户名是否已存在
    const existing = await this.userRepository.findOne({
      where: { username: dto.username },
    });

    if (existing) {
      throw new NotFoundException('用户名已存在');
    }

    // 加密密码
    const bcrypt = await import('bcrypt');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    const user = this.userRepository.create({
      ...dto,
      password: passwordHash,
    });

    await this.userRepository.save(user);
    return this.hidePassword(user);
  }

  async update(dto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id: dto.id } });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    // 如果要修改密码，需要加密
    if ((dto as any).password) {
      const bcrypt = await import('bcrypt');
      const salt = await bcrypt.genSalt(10);
      (dto as any).password = await bcrypt.hash((dto as any).password, salt);
    }

    Object.assign(user, dto);
    await this.userRepository.save(user);
    return this.hidePassword(user);
  }

  async delete(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    await this.userRepository.remove(user);
    return { success: true };
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  /**
   * 获取当前用户信息（从请求中解析 userId）
   */
  async getCurrentUserInfo(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    return {
      id: user.id,
      username: user.username,
    };
  }

  private hidePassword(user: User) {
    const { password, ...result } = user;
    return result;
  }
}
