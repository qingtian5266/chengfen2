"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_1 = require("@nestjs/jwt");
const jwt_guard_1 = require("./common/guards/jwt.guard");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const wechat_module_1 = require("./modules/wechat/wechat.module");
const search_module_1 = require("./modules/search/search.module");
const product_module_1 = require("./modules/product/product.module");
const component_module_1 = require("./modules/component/component.module");
const recognition_module_1 = require("./modules/recognition/recognition.module");
const analyze_module_1 = require("./modules/analyze/analyze.module");
const collect_module_1 = require("./modules/collect/collect.module");
const history_module_1 = require("./modules/history/history.module");
const feedback_module_1 = require("./modules/feedback/feedback.module");
const additive_module_1 = require("./additive/additive.module");
const user_entity_1 = require("./modules/users/user.entity");
const wechat_user_entity_1 = require("./modules/wechat/wechat-user.entity");
const product_entity_1 = require("./modules/product/product.entity");
const product_component_entity_1 = require("./modules/product/product-component.entity");
const component_entity_1 = require("./modules/component/component.entity");
const user_collect_entity_1 = require("./modules/collect/user-collect.entity");
const user_history_entity_1 = require("./modules/history/user-history.entity");
const user_feedback_entity_1 = require("./modules/feedback/user-feedback.entity");
const additive_entity_1 = require("./additive/additive.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ['.env.local', '.env.prod'],
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    type: 'mysql',
                    host: configService.get('DB_HOST', 'localhost'),
                    port: configService.get('DB_PORT', 3306),
                    username: configService.get('DB_USERNAME', 'root'),
                    password: configService.get('DB_PASSWORD', 'qwer1234'),
                    database: configService.get('DB_DATABASE', 'chengfen'),
                    entities: [
                        user_entity_1.User,
                        wechat_user_entity_1.WechatUser,
                        product_entity_1.Product,
                        product_component_entity_1.ProductComponent,
                        component_entity_1.ComponentEntity,
                        user_collect_entity_1.UserCollect,
                        user_history_entity_1.UserHistory,
                        user_feedback_entity_1.UserFeedback,
                        additive_entity_1.Additive,
                    ],
                    synchronize: true,
                    logging: configService.get('NODE_ENV') === 'development',
                }),
                inject: [config_1.ConfigService],
            }),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    secret: configService.get('JWT_SECRET', 'your-secret-key'),
                    signOptions: {
                        expiresIn: configService.get('JWT_EXPIRES_IN', '7d'),
                    },
                }),
                inject: [config_1.ConfigService],
                global: true,
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            wechat_module_1.WechatModule,
            search_module_1.SearchModule,
            product_module_1.ProductModule,
            component_module_1.ComponentModule,
            recognition_module_1.RecognitionModule,
            analyze_module_1.AnalyzeModule,
            collect_module_1.CollectModule,
            history_module_1.HistoryModule,
            feedback_module_1.FeedbackModule,
            additive_module_1.AdditiveModule,
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_guard_1.JwtGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map