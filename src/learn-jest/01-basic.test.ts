/**
 * Jest 基础语法测试 - 入门必看
 *
 * 【核心概念】
 * - describe(): 测试套件，用于组织相关测试用例，可以嵌套
 * - test()/it(): 测试用例，一个具体的测试
 * - expect(): 断言函数，用来判断实际值是否符合预期
 * - Matcher: 匹配器，如 toBe、toEqual、toBeTruthy 等
 *
 * 【运行方式】
 * npx jest learn-jest/01-basic.test.ts
 */

// 导入被测试的函数
import { add, fetchUser, filterEven, getUserFullName } from './math';

// ============================================
// 1. 基础断言 - expect + matcher
// ============================================

/**
 * describe() 定义一个测试套件
 * 第一个参数：套件名称（字符串）
 * 第二个参数：回调函数，里面写具体的测试用例
 */
describe('add 函数测试', () => {
  /**
   * test() 或 it() 定义一个测试用例
   * 第一个参数：测试名称，描述这个测试在验证什么
   * 第二个参数：回调函数，包含具体的断言逻辑
   *
   * expect(value) 接收实际值
   * .toBe(expected) 断言实际值严格等于期望值（使用 Object.is 比较）
   */
  test('1 + 2 应该等于 3', () => {
    expect(add(1, 2)).toBe(3);
    // add(1, 2) 是实际值，3 是期望值
    // 如果 add 返回的不是 3，这个测试就会失败
  });

  test('负数相加', () => {
    expect(add(-1, -2)).toBe(-3);
  });
});

// ============================================
// 2. 常用 Matchers（匹配器）
// ============================================

describe('常用 Matchers 演示', () => {
  // ---------- 相等性判断 ----------

  test('toBe - 基本类型相等', () => {
    // toBe 使用 Object.is 进行严格比较
    // 适用于：数字、字符串、布尔值、null、undefined
    expect(2 + 2).toBe(4);
    expect('hello').toBe('hello');
    expect(true).toBe(true);

    // 注意：toBe 不能用于对象/数组的深度比较
    // expect({ a: 1 }).toBe({ a: 1 }); // 这会失败！因为是不同的对象引用
  });

  test('toEqual - 对象/数组深度相等', () => {
    // toEqual 递归比较对象的所有属性
    // 适用于：对象、数组等引用类型
    expect({ a: 1, b: 2 }).toEqual({ a: 1, b: 2 });
    expect([1, 2, 3]).toEqual([1, 2, 3]);

    // 嵌套对象也可以
    expect({ user: { name: '张三', age: 25 } }).toEqual({
      user: { name: '张三', age: 25 },
    });
  });

  // ---------- 真假值判断 ----------

  test('toBeTruthy / toBeFalsy', () => {
    // toBeTruthy: 断言值转换为布尔后为 true
    // JavaScript 中的真值：非空字符串、非零数字、true、对象、数组、函数等
    expect(1).toBeTruthy();
    expect('hello').toBeTruthy();
    expect({}).toBeTruthy();
    expect([]).toBeTruthy();

    // toBeFalsy: 断言值转换为布尔后为 false
    // JavaScript 中的假值：0, '', null, undefined, NaN, false
    expect(0).toBeFalsy();
    expect('').toBeFalsy();
    expect(null).toBeFalsy();
    expect(undefined).toBeFalsy();
    expect(NaN).toBeFalsy();
  });

  // ---------- 数字比较 ----------

  test('数字比较', () => {
    // 大于
    expect(10).toBeGreaterThan(5);

    // 大于等于
    expect(10).toBeGreaterThanOrEqual(10);
    expect(10).toBeGreaterThanOrEqual(5);

    // 小于
    expect(5).toBeLessThan(10);

    // 小于等于
    expect(5).toBeLessThanOrEqual(5);

    // 浮点数比较 - 由于精度问题，用 toBeCloseTo 而不是 toBe
    // 0.1 + 0.2 实际等于 0.30000000000000004
    expect(0.1 + 0.2).toBeCloseTo(0.3);
    // expect(0.1 + 0.2).toBe(0.3); // 这会失败！
  });

  // ---------- 字符串匹配 ----------

  test('字符串匹配', () => {
    // toContain: 检查字符串是否包含子串
    expect('hello world').toContain('world');
    expect('hello world').toContain('hello');

    // toMatch: 使用正则表达式匹配
    expect('hello world').toMatch(/hello/);
    expect('hello world').toMatch(/^hello/); // 以 hello 开头
    expect('hello world').toMatch(/world$/); // 以 world 结尾
  });

  // ---------- 数组相关 ----------

  test('数组相关', () => {
    const arr = [1, 2, 3, 4, 5];

    // toContain: 检查数组是否包含某个元素
    expect(arr).toContain(3);
    expect(arr).toContain(1);

    // toHaveLength: 检查数组长度
    expect(arr).toHaveLength(5);

    // 也可以组合使用
    expect([1, 2, 3]).toHaveLength(3);
  });

  // ---------- 异常捕获 ----------

  test('toThrow - 捕获异常', () => {
    // 定义一个会抛出异常的函数
    const throwError = () => {
      throw new Error('出错了！');
    };

    // toThrow: 断言函数会抛出异常
    // 注意：传入的是函数本身，不是函数调用结果
    expect(throwError).toThrow();

    // 可以指定异常信息
    expect(throwError).toThrow('出错了！');

    // 也可以用正则匹配异常信息
    expect(throwError).toThrow(/出错/);

    // 错误示例：这样写不会工作，因为异常已经抛出了
    // expect(throwError()).toThrow(); // 错误！
  });
});

// ============================================
// 3. 测试异步代码
// ============================================

describe('异步测试', () => {
  // 方式1：返回 Promise
  test('fetchUser - 返回 Promise', () => {
    // 直接返回 Promise，Jest 会等待它 resolve
    // 如果不返回，测试会在 Promise 完成前就结束
    return fetchUser(1).then((user) => {
      expect(user.id).toBe(1);
      expect(user.name).toBe('User_1');
    });
  });

  // 方式2：async/await（推荐，代码更清晰）
  test('fetchUser - async/await', async () => {
    // 测试函数标记为 async
    // 使用 await 等待异步操作完成
    const user = await fetchUser(2);
    expect(user.id).toBe(2);
    expect(user.name).toBe('User_2');
  });

  // 方式3：resolves/rejects matcher
  test('fetchUser - resolves', async () => {
    // resolves: 断言 Promise 会成功 resolve
    // 可以链式调用其他 matcher
    await expect(fetchUser(3)).resolves.toEqual({
      id: 3,
      name: 'User_3',
    });
  });

  // rejects 的用法（测试 Promise 被 reject 的情况）
  test('rejects - Promise 被拒绝', async () => {
    const rejectedPromise = Promise.reject(new Error('请求失败'));

    // rejects: 断言 Promise 会被 reject
    await expect(rejectedPromise).rejects.toThrow('请求失败');
  });
});

// ============================================
// 4. 数组/对象函数测试
// ============================================

describe('filterEven 函数测试', () => {
  // 测试正常情况
  test('过滤偶数', () => {
    expect(filterEven([1, 2, 3, 4, 5, 6])).toEqual([2, 4, 6]);
  });

  // 测试边界情况：空数组
  test('空数组返回空数组', () => {
    expect(filterEven([])).toEqual([]);
  });

  // 测试边界情况：没有符合条件的元素
  test('没有偶数返回空数组', () => {
    expect(filterEven([1, 3, 5])).toEqual([]);
  });

  // 测试全是偶数的情况
  test('全是偶数', () => {
    expect(filterEven([2, 4, 6, 8])).toEqual([2, 4, 6, 8]);
  });
});

describe('getUserFullName 函数测试', () => {
  test('拼接姓名', () => {
    expect(getUserFullName({ firstName: '三', lastName: '张' })).toBe('三 张');
  });

  test('空字符串', () => {
    expect(getUserFullName({ firstName: '', lastName: '' })).toBe(' ');
  });
});

// ============================================
// 5. 否定断言 - .not
// ============================================

describe('否定断言 .not', () => {
  test('not 的用法', () => {
    // 在 matcher 前加 .not 可以否定断言
    expect(add(1, 2)).not.toBe(4);
    expect('hello').not.toContain('world');
    expect([1, 2, 3]).not.toContain(5);
    expect(0).not.toBeTruthy();
  });
});

// ============================================
// 6. 常用 Matchers 速查表
// ============================================

/*
【相等性】
  .toBe(value)           - 严格相等（Object.is）
  .toEqual(value)        - 深度相等（对象/数组）
  .toBeNull()            - 等于 null
  .toBeUndefined()       - 等于 undefined
  .toBeDefined()         - 不等于 undefined
  .toBeTruthy()          - 转换为 true
  .toBeFalsy()           - 转换为 false

【数字】
  .toBeGreaterThan(n)    - 大于
  .toBeGreaterThanOrEqual(n) - 大于等于
  .toBeLessThan(n)       - 小于
  .toBeLessThanOrEqual(n) - 小于等于
  .toBeCloseTo(number)   - 浮点数约等

【字符串】
  .toMatch(regexp)       - 正则匹配
  .toContain(string)     - 包含子串

【数组】
  .toContain(item)       - 包含元素
  .toHaveLength(number)  - 长度

【异常】
  .toThrow()             - 抛出异常
  .toThrow(error)        - 抛出指定异常

【对象】
  .toMatchObject(obj)    - 对象子集匹配
  .toHaveProperty(key)   - 拥有属性

【Promise】
  .resolves              - Promise resolve
  .rejects               - Promise reject

【取反】
  .not                   - 否定所有 matcher
*/
