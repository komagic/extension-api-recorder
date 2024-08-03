import * as packageFile from '../../package.json';

import MessageManager from './MessageManager';
import ChromeStorage from './chromeStorage';
import ConfigManager from './configManager';

class APIRecorder {
  /**
   * 存储对象
   */
  private storage: ChromeStorage;
  /**
   * 版本号
   */
  private version: string;
  /**
   * 通道对象
   */
  public channel: MessageManager;

  public message: MessageManager;

  public config: ConfigManager;

  constructor(storageType: 'sync' | 'local' = 'local') {
    this.version = packageFile.version;
    this.storage = new ChromeStorage(storageType);
    this.channel = new MessageManager('api_recorder');
    this.config = new ConfigManager(storageType, new ChromeStorage(storageType));
  }
}

export default APIRecorder;
