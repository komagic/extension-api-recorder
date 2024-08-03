import ChromeStorage from './chromeStorage';

interface Config {
  enabled: boolean;
  [key: string]: any;
}

class ConfigManager {
  private storage: ChromeStorage;
  private config: Config = { enabled: false };
  private name = 'app_config';
  private storageType: 'sync' | 'local';
  constructor(storageType: 'sync' | 'local' = 'local', storage: ChromeStorage) {
    this.storage = storage;
    this.storageType = storageType;
    this.loadConfig();
  }

  // 加载配置
  private async loadConfig(): Promise<void> {
    try {
      const storedConfig = await this.storage.get(this.name);
      if (storedConfig.config) {
        this.config = storedConfig.config;
      }
    } catch (error) {
      console.error('加载配置时出错', error);
    }
  }

  // 保存配置
  private async saveConfig(): Promise<void> {
    try {
      await this.storage.set({ config: this.config });
    } catch (error) {
      console.error('保存配置时出错', error);
    }
  }

  // 获取配置
  get value(): Config {
    return this.config;
  }

  // 设置配置
  set(newConfig: Partial<Config>): Promise<void> {
    Object.assign(this.config, newConfig);
    return this.saveConfig();
  }

  // 获取配置属性
  get<T>(key: string): T | undefined {
    return this.config[key];
  }

  // 删除配置属性
  remove(key: string): Promise<void> {
    delete this.config[key];
    return this.saveConfig();
  }

  // 清空配置
  clear(): Promise<void> {
    this.config = { enabled: false };
    return this.saveConfig();
  }
}

export default ConfigManager;
