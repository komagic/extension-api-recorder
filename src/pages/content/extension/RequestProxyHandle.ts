// 请求代理处理类

import RequestProxyConfig from './RequestProxyConfig';
import RequestProxyUtils from './RequestProxyUtils';

export default class RequestProxyHandle {
  private config: RequestProxyConfig;

  constructor(config: RequestProxyConfig) {
    this.config = config;
  }

  /**
   * 处理请求的查询参数
   * @param url 请求的url
   * @param query 请求的查询参数
   * @returns 处理后的url
   */
  public requestQueryHandle(url: string, query: any): string {
    const { overwritten, value } = query || {};
    if (!RequestProxyUtils.isJSONString(value)) return url;

    const params =
      '?' +
      RequestProxyUtils.queryStringify({
        ...(overwritten ? {} : RequestProxyUtils.getUrlSearch(url)),
        ...JSON.parse(value),
      });

    let newUrl = url.replace(/\?.*/, ''); // 清除原本存在的值
    return newUrl + params; // 如果原本有值，则替换，否则追加
  }

  /**
   * 处理请求的url和body参数
   * @param url 请求的url
   * @param body 请求的body参数
   * @param method 请求的方法，默认为GET
   * @returns 处理后的url和body参数
   */
  public requestHandler(url: string, body: any, method: string = 'GET'): [string, any] {
    let newUrl = url;
    let newBody = body;
    const isXHR = this instanceof XMLHttpRequest; // true is ajax, false is fetch

    for (const index in this.config.list) {
      const { rule, enabled, request } = this.config.list[index];
      if (!enabled || !rule) continue;
      if (!RequestProxyUtils.urlIsMatched(url, rule)) continue;

      if (request.body?.value !== '' && !RequestProxyUtils.isJSONString(request.body?.value)) {
        continue;
      }
      if (request.query?.value !== '' && !RequestProxyUtils.isJSONString(request.query?.value)) {
        continue;
      }

      // 设置 query 和 body 参数
      if (!isXHR) {
        newUrl = this.requestQueryHandle(url, request.query);
      }
      if (!['GET', 'HEAD'].includes(method.toUpperCase())) {
        if (request.body?.value) {
          newBody = JSON.stringify({
            ...(request?.body?.overwritten ? {} : JSON.parse(body)),
            ...JSON.parse(request?.body.value),
          });
        }
      }
    }
    return [newUrl, newBody];
  }

  /**
   * 处理响应结果
   * @param url 请求的url
   * @returns 处理后的响应结果
   */
  public responseHandler(url: string): any {
    let result;
    for (const index in this.config.list) {
      const { rule, enabled, response } = this.config.list[index];
      if (!enabled || !rule) continue;
      if (!RequestProxyUtils.urlIsMatched(url, rule)) continue;

      if (RequestProxyUtils.isJSONString(response)) {
        result = JSON.parse(response);
      }
      break;
    }
    return result;
  }
}
