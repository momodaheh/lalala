import type { Config } from 'jest';

const config: Config = {
  // 使用 jsdom 环境，支持 DOM API（React 组件测试需要）
  testEnvironment: 'jsdom',
  // TypeScript 转换
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  // 路径别名，和 tsconfig 里的 paths 保持一致
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@@/(.*)$': '<rootDir>/src/.umi/$1',
    // mock 掉 less/css 模块，避免样式导入报错
    '\\.(less|css)$': 'identity-obj-proxy',
  },
  // 测试文件匹配
  testMatch: ['<rootDir>/src/**/*.test.{ts,tsx}'],
  // 忽略的目录
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/.umi/'],
  // 在每个测试文件执行前运行 setup 文件
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};

export default config;
