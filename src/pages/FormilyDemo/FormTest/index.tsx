import { useState } from 'react';
import { Button, Space } from 'antd';

// ==================== 断点调试练习区 ====================
// 练习路径：F12 打开 DevTools -> Sources -> 找到本文件 ->
// 在 handleDebug 里 processOrders 那一行打断点 -> 点按钮 -> F11 一路 step into

interface Product {
  name: string;
  price: number;
  count: number;
}

interface CategoryNode {
  id: number;
  name: string;
  children?: CategoryNode[];
  products?: Product[];
}

interface Order {
  id: number;
  customer: string;
  status: 'paid' | 'refund' | 'pending';
  products: Product[];
}

// 1. 闭包：断点停进 add() 里，看 Scope 面板的 Closure 一栏，
//    totalAmount / totalOrders 这些外部变量就挂在那儿
function createAggregator() {
  let totalAmount = 0;
  let totalOrders = 0;
  const byStatus: Record<string, number> = {};

  return {
    add(order: Order) {
      totalOrders += 1;
      byStatus[order.status] = (byStatus[order.status] ?? 0) + 1;
      // 故意留的坑：浮点累加精度问题，断点停这儿 watch totalAmount，
      // 看它是怎么一步步歪成 0.30000000000000004 的
      for (const p of order.products) {
        totalAmount += p.price * p.count;
      }
    },
    summary() {
      return { totalAmount, totalOrders, byStatus };
    },
  };
}

// 2. 递归：断点打在函数第一行，观察 Call Stack 一层层压栈，
//    watch 里加 depth，看它 0 -> 1 -> 2 -> 1 地进出
function flattenTree(node: CategoryNode, depth = 0): Product[] {
  const result: Product[] = [];
  if (node.products) {
    result.push(...node.products);
  }
  if (node.children) {
    for (const child of node.children) {
      result.push(...flattenTree(child, depth + 1));
    }
  }
  return result;
}

// 3. 多层循环 + 条件分支：在 continue / break 那几行打条件断点，
//    比如 i === 2，看分支走向
function processOrders(orders: Order[], catalog: CategoryNode) {
  const aggregator = createAggregator();

  // 递归入口：step into 这里能一路跟到 flattenTree 最深处
  const allProducts = flattenTree(catalog);
  const validNames = new Set(allProducts.map((p) => p.name));

  const grouped: Record<string, Order[]> = {};
  for (let i = 0; i < orders.length; i++) {
    const order = orders[i];

    // 早退分支一：待处理订单直接跳过
    if (order.status === 'pending') {
      continue;
    }

    // 内层循环 + break：商品不在目录里，整单作废
    let valid = true;
    for (const p of order.products) {
      if (!validNames.has(p.name)) {
        valid = false;
        break;
      }
    }
    if (!valid) continue;

    aggregator.add(order);
    (grouped[order.status] ??= []).push(order);
  }

  // 按订单数排序输出，顺便再套一层 reduce 给你加戏
  const ranked = Object.entries(grouped)
    .map(([status, list]) => ({
      status,
      count: list.length,
      list: [...list].sort(
        (a, b) =>
          b.products.reduce((s, p) => s + p.price * p.count, 0) -
          a.products.reduce((s, p) => s + p.price * p.count, 0),
      ),
    }))
    .sort((a, b) => b.count - a.count);

  return { ranked, ...aggregator.summary() };
}

// 造数据：3 层分类树 + 一堆订单，价格故意塞了 0.1 / 0.2 这种浮点钉子户
function buildMockData() {
  const catalog: CategoryNode = {
    id: 1,
    name: '全部',
    children: [
      {
        id: 2,
        name: '数码',
        children: [
          { id: 3, name: '手机', products: [{ name: '手机', price: 0.1, count: 2 }] },
          { id: 4, name: '电脑', products: [{ name: '电脑', price: 0.2, count: 1 }] },
        ],
      },
      {
        id: 5,
        name: '日用',
        products: [{ name: '纸巾', price: 9.9, count: 3 }],
      },
    ],
  };

  const statuses: Order['status'][] = ['paid', 'refund', 'pending'];
  const orders: Order[] = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    customer: `顾客${i + 1}`,
    status: statuses[i % 3],
    products: [
      { name: i % 4 === 0 ? '不存在的商品' : '手机', price: 0.1, count: i + 1 },
      { name: '纸巾', price: 9.9, count: 1 },
    ],
  }));

  return { catalog, orders };
}

// ==================== 页面 ====================

const FormTest = () => {
  const [result, setResult] = useState<ReturnType<typeof processOrders> | null>(null);

  const handleDebug = () => {
    const { catalog, orders } = buildMockData();
    // 断点打在这一行，然后 F11 step into 进 processOrders
    const output = processOrders(orders, catalog);
    setResult(output);
    console.log('断点调试输出:', output);
  };

  return (
    <Space direction="vertical" size="large">
      <Button type="primary" onClick={handleDebug}>
        运行 processOrders（断点练习）
      </Button>
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </Space>
  );
};

export default FormTest;
