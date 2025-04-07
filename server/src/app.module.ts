import { Module, DynamicModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// 导入其他模块
import { UsersModule } from './users/users.module';
import * as fs from 'fs';
import * as path from 'path';

@Module({})
export class AppModule {
  static register(): DynamicModule {
    // 动态发现并加载插件模块
    const pluginModules = this.discoverPluginModules();

    return {
      module: AppModule,
      imports: [UsersModule, ...(pluginModules || [])],
      controllers: [AppController],
      providers: [AppService],
    };
  }

  /**
   * 动态发现插件模块
   */
  private static discoverPluginModules(): any[] {
    const modules: any[] = [];

    // 在构建后的目录中，实际路径是 dist/plugins/plugin1/server/src/modules/...
    // __dirname 指向 dist/server/src，所以我们需要回到 dist 根目录
    const distRoot = path.resolve(__dirname, '../..'); // 从 dist/server/src 回到 dist
    const compiledPluginsDir = path.join(distRoot, 'plugins'); // dist/plugins

    console.log(`当前目录 (__dirname): ${__dirname}`);
    console.log(`推断的编译输出根目录: ${distRoot}`);
    console.log(`扫描编译后插件目录: ${compiledPluginsDir}`);

    try {
      // 检查编译后的插件目录是否存在
      if (!fs.existsSync(compiledPluginsDir)) {
        console.warn(`编译后插件目录不存在: ${compiledPluginsDir}`);
        return modules;
      }

      // 获取所有插件文件夹 (在 dist/plugins 内)
      const plugins = fs
        .readdirSync(compiledPluginsDir)
        .filter((file) =>
          fs.statSync(path.join(compiledPluginsDir, file)).isDirectory(),
        );

      // 遍历插件
      for (const plugin of plugins) {
        // 注意：这里的路径现在是相对于 compiledPluginsDir
        // 在构建后的目录，真实路径是 dist/plugins/plugin1/server/src/modules/...
        const modulesPath = path.join(
          compiledPluginsDir,
          plugin,
          'server/src/modules',
        );

        // 检查模块目录是否存在
        if (!fs.existsSync(modulesPath)) {
          // 可能插件没有 server/src/modules 结构，跳过
          console.log(`插件 ${plugin} 中未找到 modules 目录: ${modulesPath}`);
          continue;
        }

        // 获取所有模块文件夹
        const moduleDirs = fs
          .readdirSync(modulesPath)
          .filter((file) =>
            fs.statSync(path.join(modulesPath, file)).isDirectory(),
          );

        // 遍历模块
        for (const moduleDir of moduleDirs) {
          try {
            // 构造指向编译后JS文件的绝对路径
            const moduleFileName = `${moduleDir}.module.js`; // 目标是js文件
            const compiledModulePath = path.join(
              modulesPath,
              moduleDir,
              moduleFileName,
            );

            // 再次检查具体模块文件是否存在
            if (!fs.existsSync(compiledModulePath)) {
              console.warn(`编译后的插件模块文件未找到: ${compiledModulePath}`);
              continue;
            }

            console.log(
              `发现编译后插件模块: ${plugin}/${moduleDir} at ${compiledModulePath}`,
            );

            try {
              // 使用require代替import，更稳定地加载本地文件

              const importedModule = require(compiledModulePath);
              const moduleName = `${moduleDir.charAt(0).toUpperCase() + moduleDir.slice(1)}Module`;

              // 添加更安全的类型检查
              if (
                importedModule &&
                typeof importedModule === 'object' &&
                importedModule[moduleName]
              ) {
                modules.push(importedModule[moduleName]);
                console.log(`成功加载插件模块: ${plugin}/${moduleDir}`);
              } else {
                console.warn(
                  `模块导出对象 ${moduleName} 在 ${compiledModulePath} 中未找到`,
                );
              }
            } catch (error) {
              const errorMessage =
                error instanceof Error ? error.message : String(error);
              console.error(
                `导入插件模块失败 ${plugin}/${moduleDir}: ${errorMessage}`,
              );
            }
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : String(error);
            console.error(
              `处理插件模块失败 ${plugin}/${moduleDir}: ${errorMessage}`,
            );
          }
        }
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error(`扫描编译后插件目录失败: ${errorMessage}`);
    }

    return modules;
  }
}
