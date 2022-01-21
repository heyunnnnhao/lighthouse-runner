const runLH = require('./runner');
const { mergeResponses } = require('./format');
const { fork } = require('child_process');

class LighthouseRunner {
  constructor(url = '') {
    this.url = url;
  }

  async generateChildProcess() {
    return new Promise((resolve, reject) => {
      const forked = fork('./node_modules/@jd/lighthouse-runner/src/child');
      forked.send(this.url);
      forked.on('message', async (res) => {
        resolve(res);
      });
    })
      .then((res) => {
        return res;
      })
      .catch((error) => {
        throw Error('接受子进程数据失败' + error);
      })
      .finally(() => {});
  }

  async runLighthouse(times, { isAsync = false, isGodMode = false, curveRatio = 1 }) {
    console.log(`开始测试 ${this.url}`);

    let arr = [];

    for (let i = 0; i < times; i++) {
      arr.push(isAsync ? this.generateChildProcess() : await runLH(this.url));
    }

    return Promise.allSettled(arr)
      .then((res) => {
        const validList = res.filter((i) => i.status === 'fulfilled');

        if (validList.length < 1) throw Error('跑分成功次数不足');

        const values = validList.map((i) => i.value);

        let result = mergeResponses(values, times);

        result.warnings = res.map((i) => i.reason && i.reason);

        return result;
      })
      .catch((error) => {
        console.log(error);

        throw Error('多次运行 lighthouse 失败 ' + error);
      })
      .finally(() => {
        console.log(`结束测试 ${this.url}`);
      });
  }

  async test() {
    console.log('success');
  }

  errorTest() {
    throw Error('错误抛出测试');
  }

  // 入口函数 处理配置options
  async run(times = 1, options = {}) {
    const isGodMode = options?.mode === 'god';

    const isAsync = options?.mode === 'async';

    const curveRatio = options?.curve;

    return await this.runLighthouse(times, { isAsync, isGodMode, curveRatio });
  }
}

module.exports = LighthouseRunner;