import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString()
  @MinLength(1, { message: '用户名不能为空' })
  username: string;

  @IsNotEmpty({ message: '密码不能为空' })
  @IsString()
  @MinLength(1, { message: '密码不能为空' })
  @MaxLength(50, { message: '密码长度不能超过 50 个字符' })
  password: string;
}
