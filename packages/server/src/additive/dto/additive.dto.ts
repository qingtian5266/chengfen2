import { IsNotEmpty, IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateAdditiveDto {
  @IsNotEmpty({ message: '中文名称不能为空' })
  @IsString()
  @MaxLength(100, { message: '中文名称长度不能超过 100 个字符' })
  nameCn: string;

  @IsNotEmpty({ message: '英文名称不能为空' })
  @IsString()
  @MaxLength(100, { message: '英文名称长度不能超过 100 个字符' })
  nameEn: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  alias?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  type?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  riskLevel?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  dailyLimit?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  nationalStandard?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  internationalCode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  productionMethod?: string;

  @IsOptional()
  @IsString()
  mainUsage?: string;

  @IsOptional()
  @IsString()
  healthRisk?: string;
}

export class UpdateAdditiveDto {
  @IsNotEmpty({ message: 'ID 不能为空' })
  id: number;

  @IsNotEmpty({ message: '中文名称不能为空' })
  @IsString()
  @MaxLength(100, { message: '中文名称长度不能超过 100 个字符' })
  nameCn: string;

  @IsNotEmpty({ message: '英文名称不能为空' })
  @IsString()
  @MaxLength(100, { message: '英文名称长度不能超过 100 个字符' })
  nameEn: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  alias?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  type?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  riskLevel?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  dailyLimit?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  nationalStandard?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  internationalCode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  productionMethod?: string;

  @IsOptional()
  @IsString()
  mainUsage?: string;

  @IsOptional()
  @IsString()
  healthRisk?: string;
}
