import { defineConfig } from '@umijs/max';
import { join } from 'path';
export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '@umijs/max',
  },
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      name: '首页',
      path: '/home',
      component: './Home',
    },
    {
      name: '权限演示',
      path: '/access',
      component: './Access',
    },
    {
      name: ' CRUD 示例',
      path: '/table',
      component: './Table',
    },
  ],
  npmClient: 'pnpm',
  plugins: ['./src/plugins/mora.ts'],
  extraBabelIncludes: [join(__dirname, '../plugins/plugin1')],
  alias: {
    '@plugins': join(__dirname, '../plugins'),
  },
});
