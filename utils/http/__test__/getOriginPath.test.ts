// 导入要测试的函数
import { getOriginPath } from '../getOriginPath';

describe('getOriginPath', () => {
  it('should return the URL without query parameters', () => {
    const currentUrl = 'https://example.com/path?query=1';
    const result = getOriginPath(currentUrl);
    expect(result).toBe('https://example.com/path');
  });

  it('should handle URLs that start with double slashes', () => {
    const currentUrl = '//example.com/path';
    const result = getOriginPath(currentUrl);
    expect(result).toBe(`${window.location.protocol}//example.com/path`);
  });

  it('should return the same URL if it starts with http or https', () => {
    const currentUrl = 'http://example.com/path';
    const result = getOriginPath(currentUrl);
    expect(result).toBe('http://example.com/path');
  });

  it('should handle URLs with leading and trailing spaces', () => {
    const currentUrl = '  https://example.com/path?query=1  ';
    const result = getOriginPath(currentUrl);
    expect(result).toBe('https://example.com/path');
  });

  it('should return the URL as is if an error occurs', () => {
    const currentUrl = '';
    const result = getOriginPath(currentUrl);
    expect(result).toBe('');
  });

  it('should handle edge case of missing protocol', () => {
    const currentUrl = '/example.com/path';
    const result = getOriginPath(currentUrl);
    expect(result).toBe(`${window.location.origin}/example.com/path`);
  });
});
