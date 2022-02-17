const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
import configGenerator from './configs/config-generator';
import { formatLighthouseResponse } from './format';

function chromeOptions() {
  return {
    chromeFlags: ['--headless', '--disable-gpu', '--enable-automation', '--disable-device-discovery-notifications', '--disable-sync'],
  };
}

export default async function runLH(url, configs) {
  let chrome, rawResult;

  try {
    chrome = await chromeLauncher.launch(chromeOptions());
  } catch (error) {
    throw Error('启动 chrome 失败 - ' + error);
  }

  try {
    console.log(`正在运行 lighthouse 于端口: ${chrome.port} - ${new Date().toLocaleString('zh-CN')}`);
    rawResult = await lighthouse(url, { port: chrome.port }, configGenerator(configs));
  } catch (error) {
    throw Error(`运行 lighthouse@${chrome.port} 失败 - ` + error);
  }

  try {
    await chrome.kill();
  } catch (error) {
    throw Error('关闭 chrome 失败 - ' + error);
  }

  try {
    return formatLighthouseResponse(rawResult, configs);
  } catch (error) {
    throw Error('结果格式化失败 - ' + error);
  }
}