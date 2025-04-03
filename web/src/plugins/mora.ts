import { IApi } from '@umijs/max';
import { existsSync, readFileSync } from 'fs';
import * as globModule from 'glob';
import { join } from 'path';

const glob = globModule;

// 插件类型定义
interface PluginRoute {
  path: string;
  name: string;
  component: string;
  [key: string]: any;
}

interface Plugin {
  name: string;
  description: string;
  routes?: PluginRoute[];
  access?: Record<string, boolean>;
  path?: string;
  id: string;
  [key: string]: any;
}

// 插件加载器
export default (api: IApi) => {
  // 插件初始化日志
  api.logger.info('🚀 Mora插件初始化中...');

  // 获取所有插件
  const getPlugins = (): Plugin[] => {
    api.logger.info('🔍 开始搜索插件...');
    const rootDir = join(api.cwd, '../plugins');
    api.logger.info(`📂 插件根目录: ${rootDir}`);

    const pluginDirs = glob.sync('*/plugin.json', { cwd: rootDir });
    api.logger.info(`🔎 发现 ${pluginDirs.length} 个插件配置文件`);

    return pluginDirs
      .filter((pluginPath: string) => {
        const exists = existsSync(join(rootDir, pluginPath));
        if (!exists) {
          api.logger.info(`⚠️ 插件配置文件不存在: ${pluginPath}`);
        }
        return exists;
      })
      .map((pluginPath: string) => {
        try {
          api.logger.info(`📖 加载插件配置: ${pluginPath}`);
          const content = readFileSync(join(rootDir, pluginPath), 'utf-8');
          const pluginInfo = JSON.parse(content);
          const pluginDir = pluginPath.split('/')[0];

          const plugin: Plugin = {
            ...pluginInfo,
            path: join(rootDir, pluginDir),
            id: pluginDir,
          };

          api.logger.info(`✅ 插件 [${plugin.name || plugin.id}] 加载成功`);
          if (plugin.routes?.length) {
            api.logger.info(`🛣️ 发现 ${plugin.routes.length} 条路由`);
            plugin.routes.forEach((route, index) => {
              api.logger.info(
                `  路由${index + 1}: ${route.path} => ${route.component}`,
              );
            });
          }

          return plugin;
        } catch (e) {
          api.logger.error(`❌ 加载插件失败: ${pluginPath}`, e);
          return null;
        }
      })
      .filter(Boolean) as Plugin[];
  };

  // 修改配置，注入路由
  api.modifyConfig((memo) => {
    api.logger.info('⚙️ 修改应用配置，注入插件路由');
    const plugins = getPlugins();
    api.logger.info(`📊 共加载了 ${plugins.length} 个插件`);

    // 合并插件路由
    let routeCount = 0;
    plugins.forEach((plugin: Plugin) => {
      if (plugin.routes && Array.isArray(plugin.routes)) {
        api.logger.info(`🔄 处理插件 [${plugin.name}] 的路由`);

        const processedRoutes = plugin.routes.map((route: PluginRoute) => {
          // 处理组件路径
          let componentPath = route.component;

          // 移除开头的./（如果有）
          if (componentPath.startsWith('./')) {
            componentPath = componentPath.substring(2);
          }

          // 使用绝对路径
          const absolutePath = join(
            process.cwd(),
            '../plugins',
            plugin.id,
            componentPath,
          );
          api.logger.info(`👉 路由组件绝对路径: ${absolutePath}`);

          return {
            ...route,
            component: absolutePath,
          };
        });

        memo.routes = [...(memo.routes || []), ...processedRoutes];

        routeCount += processedRoutes.length;
      }
    });

    api.logger.info(`🎉 成功注入 ${routeCount} 条插件路由`);
    return memo;
  });

  // 启动完成
  api.onDevCompileDone(() => {
    api.logger.info('✨ Mora插件加载完毕，应用启动成功');
  });

  api.onBuildComplete(() => {
    api.logger.info('🏗️ 构建完成，Mora插件已集成到应用中');
  });
};
