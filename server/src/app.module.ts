import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// 导入其他模块
import { UsersModule } from './users/users.module';
// import { PluginsModule } from './plugins/plugins.module';
import { PluginsModule } from '@mora-credit/plugin-server';

@Module({
  imports: [UsersModule, PluginsModule.register()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
