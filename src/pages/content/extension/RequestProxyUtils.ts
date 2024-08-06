/**
 * RequestProxyUtils 工具类
 */
class RequestProxyUtils {
  /**
   * 判断字符串是否为正则表达式
   * @param str 待判断的字符串
   * @returns 是否为正则表达式
   */
  public static isRegExp(str: string): boolean {
    let isRegExp;
    try {
      isRegExp = eval(str) instanceof RegExp;
    } catch (e) {
      isRegExp = false;
    }
    return isRegExp;
  }

  /**
   * 获取 URL 查询参数
   * @param str URL 查询参数字符串
   * @returns URL 查询参数对象
   */
  public static getUrlSearch(str: string): Record<string, any> {
    const s = new URLSearchParams(str);
    const obj: Record<string, any> = {};
    s.forEach((v, k) => {
      if (obj.hasOwnProperty(k)) {
        if (!Array.isArray(obj[k])) {
          obj[k] = [obj[k]];
        }
        obj[k].push(v);
      } else {
        obj[k] = v;
      }
    });
    return obj;
  }

  /**
   * 判断字符串是否为 JSON 格式
   * @param str 待判断的字符串
   * @returns 是否为 JSON 格式
   */
  public static isJSONString(str: string): boolean {
    if (typeof str === 'string') {
      try {
        const obj = JSON.parse(str);
        return Object.prototype.toString.call(obj) === '[object Object]' && obj;
      } catch (e) {
        return false;
      }
    }
    return false;
  }

  /**
   * 将对象转换为查询字符串
   * @param obj 待转换的对象
   * @returns 查询字符串
   */
  public static queryStringify(obj: Record<string, any>): string {
    const result: string[] = [];
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'function' || value === undefined) continue;
      if (Object.prototype.toString.call(value) === '[object Object]') {
        result.push(`${key}=${JSON.stringify(value)}`);
      } else if (Array.isArray(value)) {
        for (const v of value) {
          result.push(`${key}=${v}`);
        }
      } else {
        result.push(`${key}=${value}`);
      }
    }
    return result.join('&');
  }

  /**
   * 判断 URL 是否匹配规则
   * @param url 待匹配的 URL
   * @param rule 匹配规则
   * @returns 是否匹配
   */
  public static urlIsMatched(url: string, rule: string): boolean {
    return this.isRegExp(rule) ? url.match(new RegExp(rule, 'i')) !== null : url.includes(rule);
  }

  /**
   * 代理 XHR 属性
   * @param target 目标对象
   * @param attr 属性名
   */
  public static proxyXHRAttribute(target: any, attr: string): void {
    Object.defineProperty(target, attr, {
      get: () => target[`_${attr}`],
      set: val => (target[`_${attr}`] = val),
      enumerable: true,
    });
  }

  /**
   * 填充对象方法
   * @param source 源对象
   * @param name 方法名
   * @param replacementFactory 替换工厂函数
   */
  public static fill(source: any, name: string, replacementFactory: (original: Function) => Function): void {
    if (!(name in source)) return;
    const original = source[name];
    const wrapped = replacementFactory(original);
    if (typeof wrapped === 'function') {
      source[name] = wrapped;
    }
  }
}

export default RequestProxyUtils;
