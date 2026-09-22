/**
 * Jest 高级用法 - describe/nested/spy/snapshot
 * 
 * 【本文件涵盖】
 * - describe 嵌套分组：组织复杂测试结构
 * - 生命周期钩子：beforeEach/afterEach/beforeAll/afterAll
 * - jest.spyOn()：监听并修改对象方法
 * - 快照测试：toMatchSnapshot/toMatchInlineSnapshot
 * - 数据驱动测试：test.each 批量测试
 * - 控制测试执行：test.skip/test.only
 * 
 * 【运行方式】
 * npx jest learn-jest/03-advanced.test.ts
 */

// ============================================
// 1. describe 嵌套分组
// ============================================

/**
 * describe 可以嵌套使用，用于组织复杂的测试结构
 * 
 * 结构示例：
 * describe('模块A')
 *   ├── describe('功能1')
 *   │     ├── test('场景1')
 *   │     └── test('场景2')
 *   └── describe('功能2')
 *         └── test('场景3')
 */
describe('用户模块', () => {
  // 模拟一个登录函数
  const login = (username: string, password: string) => {
    if (username === 'admin' && password === '123456') {
      return { success: true, token: 'xxx' };
    }
    return { success: false, token: null };
  };

  // 模拟一个登出函数
  const logout = () => {
    return { success: true, token: null };
  };

  // 第一层嵌套：登录功能
  describe('登录功能', () => {
    test('用户名密码正确时登录成功', () => {
      const result = login('admin', '123456');
      
      // 验证返回值的多个属性
      expect(result.success).toBe(true);
      expect(result.token).toBeTruthy();
      expect(result.token).toBe('xxx');
    });

    test('密码错误时登录失败', () => {
      const result = login('admin', 'wrong');
      
      expect(result.success).toBe(false);
      expect(result.token).toBeNull();
    });

    test('用户名错误时登录失败', () => {
      const result = login('unknown', '123456');
      
      expect(result.success).toBe(false);
      expect(result.token).toBeNull();
    });

    test('空用户名或密码时登录失败', () => {
      expect(login('', '123456').success).toBe(false);
      expect(login('admin', '').success).toBe(false);
    });
  });

  // 第二层嵌套：登出功能
  describe('登出功能', () => {
    test('登出后清除 token', () => {
      const result = logout();
      
      expect(result.success).toBe(true);
      expect(result.token).toBeNull();
    });
  });

  // 第三层嵌套：权限验证
  describe('权限验证', () => {
    test('登录后有权限访问', () => {
      const loginResult = login('admin', '123456');
      
      // 模拟：登录成功后才能访问
      const canAccess = loginResult.success;
      expect(canAccess).toBe(true);
    });

    test('未登录无权限访问', () => {
      const loginResult = login('admin', 'wrong');
      
      const canAccess = loginResult.success;
      expect(canAccess).toBe(false);
    });
  });
});

// ============================================
// 2. beforeEach / afterEach / beforeAll / afterAll
// ============================================

/**
 * 生命周期钩子执行顺序：
 * 
 * beforeAll()  → 整个 describe 开始前执行一次
 *   beforeEach()  → 每个 test 之前执行
 *     test()
 *   afterEach()   → 每个 test 之后执行
 *   beforeEach()
 *     test()
 *   afterEach()
 * afterAll()   → 整个 describe 结束后执行一次
 */
describe('生命周期钩子', () => {
  let counter: number;
  let testData: string[];

  // beforeAll: 整个套件开始前执行一次
  // 适合做一次性初始化（如数据库连接）
  beforeAll(() => {
    console.log('=== 开始测试 ===');
  });

  // afterAll: 整个套件结束后执行一次
  // 适合做清理工作（如关闭数据库连接）
  afterAll(() => {
    console.log('=== 测试结束 ===');
  });

  // beforeEach: 每个 test 之前都执行
  // 适合重置测试状态，确保每个测试独立
  beforeEach(() => {
    counter = 0;
    testData = [];
  });

  // afterEach: 每个 test 之后都执行
  // 适合清理副作用
  afterEach(() => {
    // 清理工作...
  });

  test('第一次测试', () => {
    counter += 1;
    testData.push('a');
    
    expect(counter).toBe(1);
    expect(testData).toEqual(['a']);
  });

  test('第二次测试 - 状态被重置了', () => {
    // 因为 beforeEach 重新初始化了 counter 和 testData
    // 所以这里不会受到第一次测试的影响
    counter += 1;
    testData.push('b');
    
    expect(counter).toBe(1); // 不是 2！
    expect(testData).toEqual(['b']); // 不是 ['a', 'b']！
  });

  test('第三次测试 - 验证独立性', () => {
    // 每个测试都是独立的
    expect(counter).toBe(0); // 初始值
    expect(testData).toEqual([]); // 空数组
  });
});

// ============================================
// 3. jest.spyOn() - 监听对象方法
// ============================================

/**
 * jest.spyOn(object, methodName)
 * 
 * 与 jest.fn() 的区别：
 * - jest.fn() 创建一个全新的 mock 函数
 * - jest.spyOn() 监听对象已有的方法，保留原始实现
 * 
 * 常用场景：
 * - 验证某个方法是否被调用
 * - 临时修改方法的返回值
 * - 监听后恢复原始实现
 */
describe('spyOn 监听方法', () => {
  test('监听对象方法调用', () => {
    // 创建一个对象
    const video = {
      play: () => true,
      pause: () => false,
    };

    // 监听 play 方法
    // 此时 play 仍然正常工作，但调用信息被记录
    const playSpy = jest.spyOn(video, 'play');

    // 调用方法
    const result = video.play();
    
    // 原始返回值不变
    expect(result).toBe(true);
    
    // 但我们可以验证调用情况
    expect(playSpy).toHaveBeenCalled();
    expect(playSpy).toHaveBeenCalledTimes(1);
    
    // 恢复原始实现（虽然这里没改过，但这是好习惯）
    playSpy.mockRestore();
  });

  test('spyOn 并修改返回值', () => {
    const math = {
      add: (a: number, b: number) => a + b,
    };

    // 原始实现：1 + 2 = 3
    expect(math.add(1, 2)).toBe(3);

    // 监听并修改返回值
    const addSpy = jest.spyOn(math, 'add').mockReturnValue(999);

    // 现在返回值被 mock 了
    expect(math.add(1, 2)).toBe(999);
    expect(math.add(100, 200)).toBe(999); // 不管传什么参数

    // 恢复原始实现
    addSpy.mockRestore();
    
    // 又恢复正常了
    expect(math.add(1, 2)).toBe(3);
  });

  test('spyOn 并修改实现', () => {
    const calculator = {
      multiply: (a: number, b: number) => a * b,
    };

    // 监听并修改实现
    const spy = jest.spyOn(calculator, 'multiply').mockImplementation((a, b) => {
      return a * b * 2; // 改成双倍
    });

    expect(calculator.multiply(2, 3)).toBe(12); // 2 * 3 * 2

    spy.mockRestore();
    expect(calculator.multiply(2, 3)).toBe(6); // 恢复正常
  });
});

// ============================================
// 4. 快照测试 - toMatchSnapshot / toMatchInlineSnapshot
// ============================================

/**
 * 快照测试用于确保数据不会意外改变
 * 
 * 工作原理：
 * 1. 第一次运行：生成快照文件（__snapshots__/*.snap）
 * 2. 后续运行：对比当前值与快照
 * 3. 如果不一致，测试失败
 * 
 * 适用场景：
 * - React 组件的渲染结果
 * - 复杂的对象结构
 * - 配置文件
 */
describe('快照测试', () => {
  test('对象快照 - toMatchSnapshot', () => {
    const user = {
      id: 1,
      name: '张三',
      age: 25,
      hobbies: ['读书', '游泳'],
    };

    // 第一次运行会生成快照文件
    // 后续运行会对比快照，如果不一致会失败
    expect(user).toMatchSnapshot();
    
    // 快照文件位置：__snapshots__/03-advanced.test.ts.snap
  });

  test('内联快照 - toMatchInlineSnapshot', () => {
    const config = { theme: 'dark', lang: 'zh-CN' };
    
    // 内联快照直接写在代码里（作为参数）
    // 第一次运行会自动填入快照内容
    // 后续运行对比代码中的快照
    expect(config).toMatchInlineSnapshot(`
      {
        "lang": "zh-CN",
        "theme": "dark",
      }
    `);
    
    // 优点：快照就在代码里，一目了然
    // 缺点：代码会比较长
  });

  test('快照测试的实际用途', () => {
    // 假设这是一个复杂的配置对象
    const complexConfig = {
      api: {
        baseUrl: 'https://api.example.com',
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer xxx',
        },
      },
      features: {
        enableCache: true,
        maxRetries: 3,
      },
    };

    // 用快照确保配置不会被意外修改
    expect(complexConfig).toMatchSnapshot();
  });
});

// ============================================
// 5. 测试数据驱动 - test.each
// ============================================

/**
 * test.each 用于批量运行相似的测试
 * 避免写大量重复的测试代码
 * 
 * 两种语法：
 * 1. 模板字符串表格：更直观
 * 2. 数组形式：更灵活
 */
describe('数据驱动测试', () => {
  const add = (x: number, y: number) => x + y;

  // 方式1：模板字符串表格
  // 语法：反引号包裹，${} 插入值
  test.each`
    a    | b    | expected
    ${1} | ${2} | ${3}
    ${0} | ${0} | ${0}
    ${-1} | ${1} | ${0}
    ${100} | ${200} | ${300}
  `('add($a, $b) 应该等于 $expected', ({ a, b, expected }) => {
    // 每个数据组合都会运行一次这个测试
    // 测试名称中的 $a, $b, $expected 会被替换为实际值
    expect(add(a, b)).toBe(expected);
  });

  // 方式2：数组形式
  // 参数按顺序对应
  test.each([
    [1, 2, 3],
    [0, 0, 0],
    [-1, 1, 0],
    [100, 200, 300],
  ])('add(%i, %i) 应该等于 %i', (a, b, expected) => {
    // %i 表示整数占位符，会在测试名称中显示
    expect(add(a, b)).toBe(expected);
  });

  // 字符串测试的数据驱动
  test.each([
    ['hello', 'HELLO'],
    ['world', 'WORLD'],
    ['Jest', 'JEST'],
  ])('%s.toUpperCase() 应该等于 %s', (input, expected) => {
    expect(input.toUpperCase()).toBe(expected);
  });

  // 边界情况测试
  test.each`
    input          | expected
    ${''}          | ${''}
    ${'a'}         | ${'a'}
    ${'ABC'}       | ${'abc'}
    ${'aBcD'}      | ${'abcd'}
  `('$input.toLowerCase() 应该等于 $expected', ({ input, expected }) => {
    expect(input.toLowerCase()).toBe(expected);
  });
});

// ============================================
// 6. 只运行/跳过特定测试
// ============================================

describe('控制测试执行', () => {
  test('这个会执行', () => {
    expect(true).toBe(true);
  });

  /**
   * test.skip() - 跳过这个测试
   * 
   * 适用场景：
   * - 暂时不想运行某个测试
   * - 已知会失败，先跳过以后再修
   * - 测试还没写完
   * 
   * 被跳过的测试会显示为 "skipped"
   */
  test.skip('这个会被跳过', () => {
    // 这里的代码不会执行
    expect(true).toBe(false); // 不会报错，因为被跳过了
  });

  /**
   * test.only() - 只运行这个测试
   * 
   * 适用场景：
   * - 调试时只想运行某一个测试
   * - 快速验证某个功能
   * 
   * 注意：同一个 describe 中有 only 时，其他测试会被跳过
   */
  // test.only('只有这个会执行', () => {
  //   expect(true).toBe(true);
  // });

  /**
   * describe.skip() - 跳过整个测试套件
   */
  // describe.skip('整个套件被跳过', () => {
  //   test('不会执行', () => {});
  // });

  /**
   * describe.only() - 只运行这个测试套件
   */
  // describe.only('只运行这个套件', () => {
  //   test('会执行', () => {});
  // });
});

// ============================================
// 7. 高级用法速查表
// ============================================

/*
【describe 嵌套】
  - 可以多层嵌套，用于组织复杂测试结构
  - 每个 describe 有自己的 beforeEach/afterEach

【生命周期】
  beforeAll()     - 套件开始前执行一次
  afterAll()      - 套件结束后执行一次
  beforeEach()    - 每个测试前执行
  afterEach()     - 每个测试后执行

【spyOn】
  jest.spyOn(obj, method)          - 监听方法
  .mockReturnValue(value)          - 修改返回值
  .mockImplementation(fn)          - 修改实现
  .mockRestore()                   - 恢复原始

【快照测试】
  .toMatchSnapshot()               - 生成快照文件
  .toMatchInlineSnapshot(`...`)    - 内联快照
  npx jest -u                      - 更新快照

【数据驱动】
  test.each`table`(name, fn)       - 模板字符串表格
  test.each(array)(name, fn)       - 数组形式

【控制执行】
  test.skip() / describe.skip()    - 跳过
  test.only() / describe.only()    - 只运行
*/
