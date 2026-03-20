import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('user_collect')
@Index(['openid', 'product_id'], { unique: true })
export class UserCollect {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  @Index()
  openid: string;

  @Column({ type: 'int' })
  @Index()
  product_id: number;

  @CreateDateColumn()
  created_at: Date;
}
