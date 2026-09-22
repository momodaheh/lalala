import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  dva: {},
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
    {
      name: '拖拽示例',
      path: '/drag',
      component: './Drag',
    },
    {
      name: '图表示例',
      path: '/echarts',
      routes: [
        {
          name: '图表联动',
          path: '/echarts',
          component: '@/pages/Echarts/EchartsConnect',
        },
        {
          name: '图表示例',
          path: '/echarts/example',
          component: '@/pages/Echarts/EchartsExample',
        },
      ],
    },
    {
      name: 'G2 示例',
      path: '/g2',
      routes: [
        {
          name: 'G2 流程图',
          path: '/g2/flow',
          component: '@/pages/G2Demo/FlowDemo',
        },
      ],
    },
    {
      name: '表单',
      path: '/form',
      routes: [
        {
          name: '表单测试',
          path: '/form',
          component: '@/pages/FormilyDemo/FormTest',
        },
      ],
    },
    {
      name: '布局',
      path: '/layout',
      component: './Layout',
      layout: false,
    },
  ],
  npmClient: 'yarn',
});
