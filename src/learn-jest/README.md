# Jest 学习指南

这个目录包含 Jest 测试框架的学习示例。

## 文件说明

| 文件 | 内容 |
| --- | --- |
| `01-basic.test.ts` | 基础语法：断言、Matchers、异步测试 |
| `02-mock.test.ts` | Mock 函数、模块、定时器 |
| `03-advanced.test.ts` | 高级用法：嵌套 describe、生命周期、spyOn、快照、数据驱动 |
| `04-react.test.tsx` | React 组件测试（@testing-library/react） |
| `math.ts` | 被测试的函数模块 |

## 运行测试

```bash
# 运行所有测试
npm run test

# 运行单个文件
npx jest learn-jest/01-basic.test.ts

# 监听模式（文件变化自动重跑）
npx jest --watch

# 显示覆盖率
npx jest --coverage
```

## 常用命令

| 命令                        | 说明                |
| --------------------------- | ------------------- |
| `npx jest`                  | 运行所有测试        |
| `npx jest 文件名`           | 运行匹配的文件      |
| `npx jest -t "测试名"`      | 运行匹配的测试用例  |
| `npx jest --watch`          | 监听模式            |
| `npx jest --coverage`       | 生成覆盖率报告      |
| `npx jest --verbose`        | 显示详细输出        |
| `npx jest --updateSnapshot` | 更新快照（或 `-u`） |

## 常用 Matchers

```typescript
expect(value).toBe(4); // 严格相等
expect(value).toEqual({ a: 1 }); // 深度相等
expect(value).toBeTruthy(); // 真值
expect(value).toBeFalsy(); // 假值
expect(value).toContain(item); // 数组包含
expect(value).toHaveLength(3); // 长度
expect(value).toMatch(/regex/); // 正则匹配
expect(value).toThrow(); // 抛出异常
expect(value).toBeGreaterThan(5); // 大于
expect(value).toBeCloseTo(0.3); // 浮点数约等
expect(fn).toHaveBeenCalled(); // 被调用过
expect(fn).toHaveBeenCalledWith(arg); // 被调用时传参
expect(obj).toMatchSnapshot(); // 快照对比
```

## 参考链接

- [Jest 官方文档](https://jestjs.io/zh-Hans/docs/getting-started)
- [Testing Library 文档](https://testing-library.com/docs/react-testing-library/intro/)
- [Umi 测试指南](https://umijs.org/docs/guides/test)
