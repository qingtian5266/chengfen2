import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Additive } from './additive.entity';
import { AdditiveController } from './additive.controller';
import { AdditiveService } from './additive.service';

@Module({
  imports: [TypeOrmModule.forFeature([Additive])],
  controllers: [AdditiveController],
  providers: [AdditiveService],
  exports: [AdditiveService],
})
export class AdditiveModule {}
