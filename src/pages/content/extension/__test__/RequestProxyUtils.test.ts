import RequestProxyUtils from '../RequestProxyUtils';

describe('RequestProxyUtils', () => {
  describe('isRegExp', () => {
    it('should return true for a valid regular expression string', () => {
      const result = RequestProxyUtils.isRegExp('/^[a-z]+$/i');
      expect(result).toBe(true);
    });

    it('should return false for an invalid regular expression string', () => {
      const result = RequestProxyUtils.isRegExp('invalid regex');
      expect(result).toBe(false);
    });
  });

  describe('getUrlSearch', () => {
    it('should return an object with query parameters', () => {
      const result = RequestProxyUtils.getUrlSearch('a=1&b=2');
      expect(result).toEqual({ a: '1', b: '2' });
    });

    it('should handle duplicate query parameters', () => {
      const result = RequestProxyUtils.getUrlSearch('a=1&b=2&a=3');
      expect(result).toEqual({ a: ['1', '3'], b: '2' });
    });
  });

  // 其他方法的测试用例类似，省略
});
