export default {
  namespace: 'formTest',
  state: {},
  effects: {
    *getRandomNumber({}, {_call, _put} : any) {
    console.log('开始获取随机数');
    // const randomNumber = yield call(() => {
    //     // 正确的做法：直接返回一个 Promise，在 Promise 内部使用 setTimeout
    //     return new Promise((resolve) => {
    //         setTimeout(() => {
    //             resolve(Math.random());
    //         }, 1000);
    //     });
    // });
    yield Promise.resolve(Math.random());
}
  }
};
