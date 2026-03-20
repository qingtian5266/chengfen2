import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 120 })
  @Index()
  name: string;

  @Column({ type: 'varchar', length: 120, nullable: true })
  brand: string;

  @Column({ type: 'varchar', length: 64, unique: true })
  barcode: string;

  @Column({ type: 'varchar', length: 20, default: 'food' })
  category: string;

  @Column({ type: 'varchar', length: 20, default: 'medium' })
  risk_level: string;

  @Column({ type: 'text', nullable: true })
  ingredients_text: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
