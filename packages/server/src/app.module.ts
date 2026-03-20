import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { JwtGuard } from './common/guards/jwt.guard';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { WechatModule } from './modules/wechat/wechat.module';
import { SearchModule } from './modules/search/search.module';
import { ProductModule } from './modules/product/product.module';
import { ComponentModule } from './modules/component/component.module';
import { RecognitionModule } from './modules/recognition/recognition.module';
import { AnalyzeModule } from './modules/analyze/analyze.module';
import { CollectModule } from './modules/collect/collect.module';
import { HistoryModule } from './modules/history/history.module';
import { FeedbackModule } from './modules/feedback/feedback.module';
import { AdditiveModule } from './additive/additive.module';
import { User } from './modules/users/user.entity';
import { WechatUser } from './modules/wechat/wechat-user.entity';
import { Product } from './modules/product/product.entity';
import { ProductComponent } from './modules/product/product-component.entity';
import { ComponentEntity } from './modules/component/component.entity';
import { UserCollect } from './modules/collect/user-collect.entity';
import { UserHistory } from './modules/history/user-history.entity';
import { UserFeedback } from './modules/feedback/user-feedback.entity';
import { Additive } from './additive/additive.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env.prod'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 3306),
        username: configService.get('DB_USERNAME', 'root'),
        password: configService.get('DB_PASSWORD', 'qwer1234'),
        database: configService.get('DB_DATABASE', 'chengfen'),
        entities: [
          User,
          WechatUser,
          Product,
          ProductComponent,
          ComponentEntity,
          UserCollect,
          UserHistory,
          UserFeedback,
          Additive,
        ],
        synchronize: true, // 生产环境改为 false
        logging: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET', 'your-secret-key'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN', '7d'),
        },
      }),
      inject: [ConfigService],
      global: true,
    }),
    AuthModule,
    UsersModule,
    WechatModule,
    SearchModule,
    ProductModule,
    ComponentModule,
    RecognitionModule,
    AnalyzeModule,
    CollectModule,
    HistoryModule,
    FeedbackModule,
    AdditiveModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
})
export class AppModule {}
