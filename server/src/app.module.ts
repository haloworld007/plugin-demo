import { Module, DynamicModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// 导入其他模块
import { UsersModule } from './users/users.module';
import { PluginsModule } from './plugins/plugins.module';

@Module({})
export class AppModule {
  static async register(): Promise<DynamicModule> {
    return {
      module: AppModule,
      imports: [
        UsersModule,
        // 导入插件模块，它会负责发现和加载所有插件
        await PluginsModule.register(),
      ],
      controllers: [AppController],
      providers: [AppService],
    };
  }
}
