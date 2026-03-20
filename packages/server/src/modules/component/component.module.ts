import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComponentController } from './component.controller';
import { ComponentService } from './component.service';
import { ComponentEntity } from './component.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ComponentEntity])],
  controllers: [ComponentController],
  providers: [ComponentService],
})
export class ComponentModule {}
