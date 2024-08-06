export default class RequestProxyConfig {
  public enabled: boolean = false;
  public list: Array<{
    rule: string;
    enabled: boolean;
    request: any;
    state?: string[];
  }> = [];
}
