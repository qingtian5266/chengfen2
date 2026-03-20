import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('wechat_user')
export class WechatUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  openid: string; // 微信 openid

  @Column({ type: 'varchar', length: 100, nullable: true })
  unionid: string; // 微信 unionid（多应用统一标识）

  @Column({ type: 'varchar', length: 100, nullable: true })
  nickname: string; // 微信昵称

  @Column({ type: 'tinyint', default: 1 })
  sex: number; // 0-未知，1-男，2-女

  @Column({ type: 'varchar', length: 50, nullable: true })
  province: string; // 省份

  @Column({ type: 'varchar', length: 50, nullable: true })
  city: string; // 城市

  @Column({ type: 'varchar', length: 100, nullable: true })
  country: string; // 国家

  @Column({ type: 'varchar', length: 255, nullable: true })
  avatar: string; // 头像 URL

  @Column({ type: 'varchar', length: 100, nullable: true })
  phone: string; // 绑定的手机号（需要用户授权获取）

  @Column({ type: 'tinyint', default: 1 })
  status: number; // 0-禁用，1-启用

  @Column({ type: 'varchar', length: 20, default: 'user' })
  role: string; // admin/user

  @Column({ type: 'varchar', length: 255, nullable: true })
  access_token: string; // 微信 access_token

  @Column({ type: 'integer', nullable: true })
  token_expires_at: number; // access_token 过期时间戳

  @Column({ type: 'varchar', length: 100, nullable: true })
  refresh_token: string; // 微信 refresh_token

  @Column({ type: 'varchar', length: 50, nullable: true })
  scope: string; // 授权作用域

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'datetime', nullable: true })
  last_login_at: Date; // 最后登录时间
}
