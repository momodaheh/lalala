/**
 * 被测试的函数模块
 */

// 简单加法
export function add(a: number, b: number): number {
  return a + b;
}

// 异步请求模拟
export function fetchUser(id: number): Promise<{ id: number; name: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id, name: `User_${id}` });
    }, 100);
  });
}

// 数组操作
export function filterEven(numbers: number[]): number[] {
  return numbers.filter((n) => n % 2 === 0);
}

// 对象操作
export function getUserFullName(user: { firstName: string; lastName: string }): string {
  return `${user.firstName} ${user.lastName}`;
}
