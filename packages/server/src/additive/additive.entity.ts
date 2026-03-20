import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('additive')
export class Additive {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  nameCn: string; // 中文名称（必填）

  @Column({ type: 'varchar', length: 100 })
  nameEn: string; // 英文名称（必填）

  @Column({ type: 'varchar', length: 200, nullable: true })
  alias: string; // 别名

  @Column({ type: 'text', nullable: true })
  description: string; // 描述

  @Column({ type: 'varchar', length: 50, nullable: true })
  type: string; // 分类

  @Column({ type: 'varchar', length: 50, nullable: true })
  riskLevel: string; // 风险等级

  @Column({ type: 'varchar', length: 100, nullable: true })
  dailyLimit: string; // 每日限值

  @Column({ type: 'varchar', length: 100, nullable: true })
  nationalStandard: string; // 国家标准类别

  @Column({ type: 'varchar', length: 50, nullable: true })
  internationalCode: string; // 国际编号

  @Column({ type: 'varchar', length: 200, nullable: true })
  productionMethod: string; // 生成方式

  @Column({ type: 'text', nullable: true })
  mainUsage: string; // 主要用途

  @Column({ type: 'text', nullable: true })
  healthRisk: string; // 健康风险描述

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
