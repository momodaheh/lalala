/**
 * React 组件测试 - 使用 @testing-library/react
 * 
 * 【核心原则】
 * Testing Library 的核心理念是："你的测试越接近用户使用软件的方式，它就越能给你信心"
 * 
 * - 通过用户视角查询元素（文本、角色、标签等）
 * - 模拟真实用户行为（点击、输入、键盘事件等）
 * - 避免依赖组件内部实现
 * 
 * 【核心 API】
 * - render(): 渲染组件
 * - screen: 查询元素的集合
 * - fireEvent: 触发 DOM 事件
 * - userEvent: 模拟更真实的用户交互
 * - waitFor: 等待异步操作
 * 
 * 【运行方式】
 * npx jest learn-jest/04-react.test.tsx
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// ============================================
// 测试用的 React 组件
// ============================================

/**
 * 简单展示组件
 * - 接收 name 属性，默认值 'Anonymous'
 * - 渲染一个 h1 标题
 */
const Greet: React.FC<{ name?: string }> = ({ name = 'Anonymous' }) => {
  return <h1>Hello, {name}!</h1>;
};

/**
 * 计数器组件
 * - 展示当前计数
 * - 两个按钮：增加、重置
 */
const Counter: React.FC = () => {
  const [count, setCount] = React.useState(0);
  return (
    <div>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount(count + 1)}>Increment</button>
      <button type="button" onClick={() => setCount(0)}>Reset</button>
    </div>
  );
};

/**
 * 输入框组件
 * - 受控输入框
 * - 实时显示输入内容
 */
const InputDemo: React.FC = () => {
  const [value, setValue] = React.useState('');
  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="请输入..."
        data-testid="my-input"
      />
      <p>你输入了: {value}</p>
    </div>
  );
};

/**
 * 异步组件
 * - 点击按钮加载数据
 * - 有 loading 状态
 */
const AsyncComponent: React.FC = () => {
  const [data, setData] = React.useState<string>('');
  const [loading, setLoading] = React.useState(false);

  const fetchData = async () => {
    setLoading(true);
    // 模拟异步请求
    await new Promise((resolve) => { setTimeout(resolve, 100); });
    setData('加载完成的数据');
    setLoading(false);
  };

  return (
    <div>
      <button type="button" onClick={fetchData} disabled={loading}>
        {loading ? '加载中...' : '加载数据'}
      </button>
      {data && <p data-testid="result">{data}</p>}
    </div>
  );
};

// ============================================
// 测试用例
// ============================================

describe('Greet 组件测试', () => {
  /**
   * render() - 渲染组件
   * 
   * render 返回一个对象，包含：
   * - container: 渲染的 DOM 容器
   * - unmount: 卸载组件的函数
   * - rerender: 重新渲染
   * - ...其他查询方法
   */
  test('渲染默认内容', () => {
    // 渲染组件
    render(<Greet />);
    
    // screen 包含所有查询方法
    // getByText: 通过文本内容查找元素，找不到会报错
    const heading = screen.getByText('Hello, Anonymous!');
    
    // 验证元素存在
    expect(heading).toBeInTheDocument();
    
    // 验证是 h1 标签
    expect(heading.tagName).toBe('H1');
  });

  test('渲染传入的 name', () => {
    // 传入 props
    render(<Greet name="张三" />);
    
    // 查找包含指定文本的元素
    expect(screen.getByText('Hello, 张三!')).toBeInTheDocument();
  });

  /**
   * queryByText vs getByText
   * 
   * - getByText: 找不到会抛出错误（断言元素存在）
   * - queryByText: 找不到返回 null（断言元素不存在）
   */
  test('queryByText - 元素不存在时返回 null', () => {
    render(<Greet />);
    
    // 这个文本不存在
    // queryByText 返回 null，不会报错
    expect(screen.queryByText('Hello, 张三!')).toBeNull();
    
    // 如果用 getByText 查找不存在的元素，会报错
    // expect(screen.getByText('Hello, 张三!')).toBeNull(); // 这行会报错！
  });

  test('容器查询 - container', () => {
    const { container } = render(<Greet name="测试" />);
    
    // container 是渲染的根元素
    // 可以用原生 DOM API 查询
    const h1 = container.querySelector('h1');
    expect(h1).toHaveTextContent('Hello, 测试!');
  });
});

describe('Counter 组件测试', () => {
  test('初始计数为 0', () => {
    render(<Counter />);
    
    // 查找包含 "Count: 0" 文本的元素
    expect(screen.getByText('Count: 0')).toBeInTheDocument();
  });

  /**
   * fireEvent - 触发 DOM 事件
   * 
   * 常用事件：
   * - fireEvent.click(element) - 点击
   * - fireEvent.change(element, { target: { value: '...' } }) - 改变输入
   * - fireEvent.focus(element) - 聚焦
   * - fireEvent.blur(element) - 失焦
   * - fireEvent.keyDown(element, { key: 'Enter' }) - 按键
   */
  test('点击按钮计数增加', () => {
    render(<Counter />);
    
    // 通过文本找到按钮
    const button = screen.getByText('Increment');
    
    // 触发点击事件
    fireEvent.click(button);
    
    // 验证计数更新
    expect(screen.getByText('Count: 1')).toBeInTheDocument();
  });

  test('多次点击', () => {
    render(<Counter />);
    
    const button = screen.getByText('Increment');
    
    // 连续点击 3 次
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);
    
    expect(screen.getByText('Count: 3')).toBeInTheDocument();
  });

  test('重置按钮', () => {
    render(<Counter />);
    
    // 先增加计数
    fireEvent.click(screen.getByText('Increment'));
    fireEvent.click(screen.getByText('Increment'));
    expect(screen.getByText('Count: 2')).toBeInTheDocument();
    
    // 点击重置
    fireEvent.click(screen.getByText('Reset'));
    
    // 验证归零
    expect(screen.getByText('Count: 0')).toBeInTheDocument();
  });

  /**
   * userEvent vs fireEvent
   * 
   * - fireEvent: 直接触发 DOM 事件，更底层
   * - userEvent: 模拟真实用户行为，会触发完整的事件序列
   * 
   * 例如点击：
   * - fireEvent.click: 只触发 click 事件
   * - userEvent.click: 触发 mouseover → mousemove → mousedown → focus → mouseup → click
   * 
   * 推荐：优先使用 userEvent，更接近真实用户行为
   */
  test('使用 userEvent（更接近真实用户行为）', async () => {
    render(<Counter />);
    
    const button = screen.getByText('Increment');
    
    // userEvent 是异步的，需要 await
    await userEvent.click(button);
    
    expect(screen.getByText('Count: 1')).toBeInTheDocument();
  });
});

describe('InputDemo 组件测试', () => {
  test('输入内容显示在页面上', () => {
    render(<InputDemo />);
    
    // getByPlaceholderText: 通过 placeholder 查找输入框
    const input = screen.getByPlaceholderText('请输入...');
    
    // 模拟输入
    fireEvent.change(input, { target: { value: '你好世界' } });
    
    // 验证显示的内容
    expect(screen.getByText('你输入了: 你好世界')).toBeInTheDocument();
  });

  /**
   * data-testid - 测试专用标识符
   * 
   * 当元素没有好的查询方式时，可以添加 data-testid 属性
   * <input data-testid="my-input" />
   * 
   * 注意：只在必要时使用，优先用用户可见的属性查询
   */
  test('使用 data-testid 查找元素', () => {
    render(<InputDemo />);
    
    // getByTestId: 通过 data-testid 查找
    const input = screen.getByTestId('my-input');
    
    // 模拟输入
    fireEvent.change(input, { target: { value: '测试' } });
    
    // toHaveValue: 验证输入框的值
    expect(input).toHaveValue('测试');
  });

  test('使用 userEvent 输入', async () => {
    render(<InputDemo />);
    
    const input = screen.getByPlaceholderText('请输入...');
    
    // userEvent.type: 模拟逐个字符输入
    await userEvent.type(input, 'Hello');
    
    // 验证输入框的值
    expect(input).toHaveValue('Hello');
    
    // 验证页面显示
    expect(screen.getByText('你输入了: Hello')).toBeInTheDocument();
  });

  test('清空输入框', async () => {
    render(<InputDemo />);
    
    const input = screen.getByPlaceholderText('请输入...');
    
    // 先输入内容
    await userEvent.type(input, '初始内容');
    expect(input).toHaveValue('初始内容');
    
    // 清空输入框
    await userEvent.clear(input);
    
    // 验证已清空
    expect(input).toHaveValue('');
  });
});

describe('AsyncComponent 异步测试', () => {
  /**
   * waitFor - 等待异步操作完成
   * 
   * 用于测试涉及异步操作的组件（如 API 请求）
   * waitFor 会重复执行回调，直到不抛出错误或超时
   */
  test('点击按钮后加载数据', async () => {
    render(<AsyncComponent />);
    
    // 初始状态：按钮显示"加载数据"
    const button = screen.getByText('加载数据');
    expect(button).toBeInTheDocument();
    
    // 点击按钮触发加载
    fireEvent.click(button);
    
    // 按钮变成"加载中..."
    expect(screen.getByText('加载中...')).toBeInTheDocument();
    
    // 等待异步操作完成
    // waitFor 会反复检查，直到条件满足或超时（默认 1000ms）
    await waitFor(() => {
      expect(screen.getByTestId('result')).toHaveTextContent('加载完成的数据');
    });
    
    // 验证按钮恢复
    expect(screen.getByText('加载数据')).toBeInTheDocument();
  });

  test('findByText - 异步查找元素', async () => {
    render(<AsyncComponent />);
    
    fireEvent.click(screen.getByText('加载数据'));
    
    // findByText: 异步版本的 getByText
    // 返回 Promise，会等待元素出现
    const result = await screen.findByTestId('result');
    
    expect(result).toHaveTextContent('加载完成的数据');
  });
});

// ============================================
// 常用查询方法速查
// ============================================

/*
【查询方法分类】

getBy...   - 找不到会报错（断言元素存在）
queryBy... - 找不到返回 null（断言元素不存在）
findBy...  - 异步版本，返回 Promise（等待元素出现）

getAllBy... / queryAllBy... / findAllBy... - 查找多个元素，返回数组

【常用查询方式】

ByRole        - 通过 ARIA 角色（button, heading, textbox 等）
  screen.getByRole('button')
  screen.getByRole('heading', { level: 1 })

ByText        - 通过文本内容
  screen.getByText('点击我')
  screen.getByText(/正则表达式/)

ByPlaceholderText - 通过 placeholder
  screen.getByPlaceholderText('请输入...')

ByLabelText   - 通过 label
  screen.getByLabelText('用户名')

ByTestId      - 通过 data-testid（最后的选择）
  screen.getByTestId('my-element')

ByAltText     - 通过 alt 属性（图片）
  screen.getByAltText('图片描述')

ByTitle       - 通过 title 属性
  screen.getByTitle('标题')

【优先级建议】
1. getByRole - 最接近用户视角
2. getByLabelText - 表单元素首选
3. getByPlaceholderText - 输入框
4. getByText - 普通文本
5. getByTestId - 最后的选择
*/

// ============================================
// 常用断言
// ============================================

/*
【DOM 元素断言】（需要 @testing-library/jest-dom）

toBeInTheDocument()     - 在文档中
toBeVisible()           - 可见
toBeHidden()            - 隐藏
toBeDisabled()          - 禁用
toBeEnabled()           - 启用
toBeEmpty()             - 为空
toHaveTextContent()     - 包含文本
toHaveAttribute()       - 有属性
toHaveClass()           - 有 class
toHaveStyle()           - 有样式
toHaveValue()           - 有值（表单）
toBeChecked()           - 被选中（checkbox/radio）
*/
