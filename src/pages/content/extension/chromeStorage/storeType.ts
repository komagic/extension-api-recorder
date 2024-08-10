export interface IStore {
  /**
   * 版本号
   */
  version: string;
  /**
   * 存储名称
   */
  storeName: string;
  /**
   * 是否启用
   */
  enable: boolean;
  /**
   * API配置数据
   */
  store: {
    [key: string]: IAPIConfig;
  };
}

/**
 * API配置接口
 */
export interface IAPIConfig {
  /**
   * API地址
   */
  url: string;
  /**
   * 是否启用记录
   */
  enable_record: boolean;
  /**
   * 是否启用Mock
   */
  enable_mock: boolean;

  /**
   * respoonsetext 缓存数据
   * */
  data: string[];
}
