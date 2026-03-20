import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService, UserListDto, CreateUserDto, UpdateUserDto } from './users.service';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { Public } from '../../common/decorators/public.decorator';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Public()
  @Post('list')
  async list(@Body() dto: UserListDto) {
    return this.usersService.list(dto);
  }

  @Public()
  @Post('detail')
  async detail(@Body() dto: { id: number }) {
    return this.usersService.detail(dto.id);
  }

  @Public()
  @Post('create')
  async create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Public()
  @Post('update')
  async update(@Body() dto: UpdateUserDto) {
    return this.usersService.update(dto);
  }

  @Public()
  @Post('delete')
  async delete(@Body() dto: { id: number }) {
    return this.usersService.delete(dto.id);
  }
}

@Controller('user')
export class UserController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtGuard)
  @Post('info')
  async info(@Request() req) {
    const userId = req.user.sub;
    return this.usersService.getCurrentUserInfo(userId);
  }
}
