/**
 * Jest Mock 测试 - 模拟函数、模块、定时器
 * 
 * 【为什么需要 Mock？】
 * - 隔离测试：不依赖真实的 API 请求、数据库、文件系统等
 * - 控制行为：让函数返回我们想要的值
 * - 验证调用：检查函数是否被调用、调用了几次、传了什么参数
 * 
 * 【核心 API】
 * - jest.fn(): 创建 mock 函数
 * - jest.spyOn(): 监听对象方法
 * - jest.mock(): 模拟整个模块
 * - jest.useFakeTimers(): 模拟定时器
 * 
 * 【运行方式】
 * npx jest learn-jest/02-mock.test.ts
 */

// ============================================
// 1. Mock 函数 - jest.fn()
// ============================================

describe('Mock 函数基础', () => {
  /**
   * jest.fn() 创建一个"空"的 mock 函数
   * - 可以被调用
   * - 会记录所有调用信息（次数、参数、返回值）
   * - 默认返回 undefined
   */
  test('jest.fn() 创建 mock 函数', () => {
    // 创建一个 mock 函数
    const mockFn = jest.fn();
    
    // 调用它，传什么参数都行
    mockFn('参数1');
    mockFn('参数2');
    
    // ============ 验证调用信息 ============
    
    // 验证调用次数
    expect(mockFn).toHaveBeenCalledTimes(2);
    
    // 验证是否被调用过（至少一次）
    expect(mockFn).toHaveBeenCalled();
    
    // 验证是否从未被调用（与上面相反）
    // expect(mockFn).not.toHaveBeenCalled();
    
    // 验证调用参数 - 是否曾经以这些参数调用过
    expect(mockFn).toHaveBeenCalledWith('参数1');
    expect(mockFn).toHaveBeenCalledWith('参数2');
    
    // 验证最后一次调用的参数
    expect(mockFn).toHaveBeenLastCalledWith('参数2');
    
    // 验证第 N 次调用的参数（从 1 开始）
    expect(mockFn).toHaveBeenNthCalledWith(1, '参数1');
    expect(mockFn).toHaveBeenNthCalledWith(2, '参数2');
  });

  /**
   * mockReturnValue - 设置 mock 函数的固定返回值
   * 调用后，每次调用 mock 函数都会返回这个值
   */
  test('mock 函数返回值 - mockReturnValue', () => {
    const mockFn = jest.fn();
    
    // 设置固定返回值
    mockFn.mockReturnValue('固定返回值');
    
    // 每次调用都返回相同的值
    expect(mockFn()).toBe('固定返回值');
    expect(mockFn()).toBe('固定返回值');
    expect(mockFn()).toBe('固定返回值');
    
    // 可以传任意类型
    mockFn.mockReturnValue({ data: '对象' });
    expect(mockFn()).toEqual({ data: '对象' });
  });

  /**
   * mockReturnValueOnce - 设置"下一次"调用的返回值
   * 可以链式调用，每次调用按顺序返回不同的值
   * 当 Once 的都用完后，返回 mockReturnValue 的值（或 undefined）
   */
  test('mock 函数返回值 - mockReturnValueOnce（每次不同）', () => {
    const mockFn = jest.fn();
    
    // 链式设置每次不同的返回值
    mockFn
      .mockReturnValueOnce('第一次')   // 第 1 次调用返回
      .mockReturnValueOnce('第二次')   // 第 2 次调用返回
      .mockReturnValue('默认');         // 之后都返回这个
    
    expect(mockFn()).toBe('第一次');   // 第 1 次
    expect(mockFn()).toBe('第二次');   // 第 2 次
    expect(mockFn()).toBe('默认');     // 第 3 次及以后
    expect(mockFn()).toBe('默认');     // 第 4 次及以后
  });

  /**
   * mockImplementation - 设置 mock 函数的完整实现
   * 可以接收参数并返回计算结果
   */
  test('mock 函数实现 - mockImplementation', () => {
    // 方式1：创建时传入实现
    const mockFn = jest.fn((a: number, b: number) => a + b);
    
    expect(mockFn(1, 2)).toBe(3);
    expect(mockFn(3, 4)).toBe(7);
    
    // 方式2：后续修改实现
    const mockFn2 = jest.fn();
    mockFn2.mockImplementation((x: string) => x.toUpperCase());
    
    expect(mockFn2('hello')).toBe('HELLO');
  });

  /**
   * mockResolvedValue / mockRejectedValue
   * 专门用于模拟返回 Promise 的异步函数
   */
  test('mock 异步函数 - mockResolvedValue', async () => {
    const mockApi = jest.fn();
    
    // 模拟返回一个 resolve 的 Promise
    mockApi.mockResolvedValue({ data: '成功' });
    
    const result = await mockApi();
    expect(result).toEqual({ data: '成功' });
  });

  test('mock 异步函数 - mockRejectedValue', async () => {
    const mockApi = jest.fn();
    
    // 模拟返回一个 reject 的 Promise
    mockApi.mockRejectedValue(new Error('请求失败'));
    
    // 需要用 try/catch 或 .catch 捕获错误
    await expect(mockApi()).rejects.toThrow('请求失败');
  });
});

// ============================================
// 2. Mock 回调函数
// ============================================

describe('Mock 回调', () => {
  /**
   * 当函数接收回调作为参数时，
   * 用 mock 函数作为回调，可以验证回调是否被调用
   */
  test('forEach 回调被调用', () => {
    // 创建一个 mock 回调函数
    const mockCallback = jest.fn();
    
    // 模拟一个 forEach 操作
    [1, 2, 3].forEach((item) => mockCallback(item));
    
    // 验证回调被调用了 3 次
    expect(mockCallback).toHaveBeenCalledTimes(3);
    
    // 验证每次调用的参数
    expect(mockCallback).toHaveBeenNthCalledWith(1, 1); // 第 1 次传入 1
    expect(mockCallback).toHaveBeenNthCalledWith(2, 2); // 第 2 次传入 2
    expect(mockCallback).toHaveBeenNthCalledWith(3, 3); // 第 3 次传入 3
  });

  test('模拟带回调的函数', () => {
    // 假设有一个函数，接收数组和回调
    const forEachCallback = (items: number[], callback: (item: number) => void) => {
      items.forEach(callback);
    };
    
    // 用 mock 函数作为回调传入
    const mockCallback = jest.fn();
    forEachCallback([1, 2, 3], mockCallback);
    
    // 验证回调被调用了 3 次
    expect(mockCallback).toHaveBeenCalledTimes(3);
    // 注意：forEach 的回调实际接收 3 个参数 (item, index, array)
    // 但我们的 callback 只声明了 1 个参数，所以验证第一个即可
    expect(mockCallback).toHaveBeenNthCalledWith(1, 1, 0, [1, 2, 3]);
  });

  test('模拟异步回调', () => {
    // 模拟 setTimeout 的回调
    jest.useFakeTimers(); // 使用假定时器
    
    const mockCallback = jest.fn();
    setTimeout(mockCallback, 1000);
    
    // 此时回调还没执行
    expect(mockCallback).not.toHaveBeenCalled();
    
    // 快进时间
    jest.runAllTimers();
    
    // 现在回调执行了
    expect(mockCallback).toHaveBeenCalledTimes(1);
    
    jest.useRealTimers(); // 恢复真实定时器
  });
});

// ============================================
// 3. Mock 模块
// ============================================

/**
 * jest.mock('模块名', 工厂函数)
 * - 必须在文件顶层调用（不能在 describe/test 内部）
 * - 工厂函数返回的对象会替代原模块的导出
 */

// 模拟整个 axios 模块
jest.mock('axios', () => ({
  // 模拟 axios.get 方法
  get: jest.fn(),
  // 模拟 axios.post 方法
  post: jest.fn(),
  // 模拟 default 导出（如果有）
  default: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

describe('Mock 模块', () => {
  test('模拟 API 请求 - GET', async () => {
    // 导入被 mock 的模块
    const axios = require('axios');
    
    // 设置这一次调用的返回值
    axios.get.mockResolvedValueOnce({
      data: { id: 1, name: '测试用户' },
      status: 200,
    });
    
    // 调用 API
    const response = await axios.get('/api/user/1');
    
    // 验证返回值
    expect(response.data).toEqual({ id: 1, name: '测试用户' });
    
    // 验证 axios.get 被以正确的参数调用
    expect(axios.get).toHaveBeenCalledWith('/api/user/1');
    expect(axios.get).toHaveBeenCalledTimes(1);
  });

  test('模拟 API 请求 - POST', async () => {
    const axios = require('axios');
    
    // 模拟 POST 请求的返回值
    axios.post.mockResolvedValueOnce({
      data: { success: true, id: 123 },
      status: 201,
    });
    
    // 发送 POST 请求
    const response = await axios.post('/api/user', { name: '新用户' });
    
    expect(response.data.success).toBe(true);
    expect(axios.post).toHaveBeenCalledWith('/api/user', { name: '新用户' });
  });

  test('模拟 API 错误', async () => {
    const axios = require('axios');
    
    // 模拟请求失败
    axios.get.mockRejectedValueOnce(new Error('Network Error'));
    
    // 需要用 try/catch 或 .catch 处理
    await expect(axios.get('/api/error')).rejects.toThrow('Network Error');
  });
});

// ============================================
// 4. 模拟定时器 - jest.useFakeTimers()
// ============================================

describe('模拟定时器', () => {
  // 每个测试前启用假定时器
  beforeEach(() => {
    jest.useFakeTimers();
  });

  // 每个测试后恢复真实定时器
  afterEach(() => {
    jest.useRealTimers();
  });

  test('setTimeout 被调用', () => {
    const callback = jest.fn();
    
    // 设置一个 1 秒后执行的定时器
    setTimeout(callback, 1000);
    
    // 此时 setTimeout 还没执行
    expect(callback).not.toHaveBeenCalled();
    
    // 快进所有定时器（不管多少时间）
    jest.runAllTimers();
    
    // 现在回调执行了
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test('setInterval 多次执行', () => {
    const callback = jest.fn();
    
    // 设置一个每 1 秒执行一次的定时器
    setInterval(callback, 1000);
    
    // 快进 3.5 秒
    jest.advanceTimersByTime(3500);
    
    // 回调应该执行了 3 次（1秒、2秒、3秒）
    expect(callback).toHaveBeenCalledTimes(3);
  });

  test('快进指定时间', () => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();
    
    setTimeout(callback1, 1000);
    setTimeout(callback2, 3000);
    
    // 只快进 2 秒
    jest.advanceTimersByTime(2000);
    
    // 只有第一个回调执行了（1秒 < 2秒）
    expect(callback1).toHaveBeenCalledTimes(1);
    // 第二个还没执行（3秒 > 2秒）
    expect(callback2).not.toHaveBeenCalled();
  });
});

// ============================================
// 5. 清除 Mock 状态
// ============================================

describe('清除 Mock', () => {
  /**
   * mockClear() - 清除调用记录
   * - 清除调用次数、参数等信息
   * - 不清除实现（mockReturnValue 等仍然有效）
   */
  test('mockClear - 清除调用记录', () => {
    const mockFn = jest.fn();
    
    mockFn('第一次');
    expect(mockFn).toHaveBeenCalledTimes(1);
    
    // 清除调用记录
    mockFn.mockClear();
    
    // 调用次数被重置
    expect(mockFn).toHaveBeenCalledTimes(0);
    
    // 但函数仍然可以被调用
    mockFn('第二次');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  /**
   * mockReset() - 完全重置
   * - 清除调用记录
   * - 清除实现（mockReturnValue、mockImplementation 等）
   * - 调用后返回 undefined
   */
  test('mockReset - 清除调用记录 + 实现', () => {
    const mockFn = jest.fn(() => '原始实现');
    
    expect(mockFn()).toBe('原始实现');
    
    // 完全重置
    mockFn.mockReset();
    
    // 实现被清除了，返回 undefined
    expect(mockFn()).toBeUndefined();
    
    // 调用记录也被清除了
    expect(mockFn).toHaveBeenCalledTimes(1); // 刚才调用了一次
  });

  /**
   * mockRestore() - 恢复原始实现
   * - 只对 jest.spyOn() 创建的 mock 有效
   * - 会清除所有 mock 状态并恢复原始方法
   */
  test('mockRestore - 只配合 spyOn 使用', () => {
    const obj = {
      greet: () => '你好',
    };

    // mockRestore 只对 spyOn 有效
    const spy = jest.spyOn(obj, 'greet').mockReturnValue('模拟');
    expect(obj.greet()).toBe('模拟');

    spy.mockRestore(); // 恢复原始实现
    expect(obj.greet()).toBe('你好');
  });

  /**
   * 全局清除 - 在 beforeEach 中清除所有 mock
   * 这样每个测试用例都从干净的状态开始
   */
  test('jest.clearAllMocks() - 清除所有 mock 记录', () => {
    // 这个函数会清除所有 mock 函数的调用记录
    // 通常在 beforeEach 中调用
    jest.clearAllMocks();
  });

  test('jest.resetAllMocks() - 重置所有 mock', () => {
    // 这个函数会重置所有 mock（清除记录 + 清除实现）
    jest.resetAllMocks();
  });
});

// ============================================
// 6. Mock 方法速查表
// ============================================

/*
【创建 Mock】
  jest.fn()                    - 创建空的 mock 函数
  jest.fn(implementation)      - 创建带实现的 mock
  jest.spyOn(object, method)   - 监听对象的方法

【设置返回值】
  .mockReturnValue(value)      - 固定返回值
  .mockReturnValueOnce(value)  - 下一次调用的返回值
  .mockResolvedValue(value)    - 返回 resolve 的 Promise
  .mockResolvedValueOnce(value)- 下一次返回 resolve 的 Promise
  .mockRejectedValue(error)    - 返回 reject 的 Promise
  .mockImplementation(fn)      - 设置完整实现

【验证调用】
  .toHaveBeenCalled()          - 被调用过
  .toHaveBeenCalledTimes(n)    - 被调用 n 次
  .toHaveBeenCalledWith(args)  - 被以指定参数调用过
  .toHaveBeenLastCalledWith()  - 最后一次调用的参数
  .toHaveBeenNthCalledWith(n)  - 第 n 次调用的参数

【清除/重置】
  .mockClear()                 - 清除调用记录
  .mockReset()                 - 清除记录 + 实现
  .mockRestore()               - 恢复原始（仅 spyOn）
  jest.clearAllMocks()         - 清除所有 mock 记录
  jest.resetAllMocks()         - 重置所有 mock

【定时器】
  jest.useFakeTimers()         - 启用假定时器
  jest.useRealTimers()         - 恢复真实定时器
  jest.runAllTimers()          - 快进所有定时器
  jest.advanceTimersByTime(ms) - 快进指定时间
  jest.runOnlyPendingTimers()  - 只快进到下一个定时器
*/
