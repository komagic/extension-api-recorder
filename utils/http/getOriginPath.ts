import { logger } from '@root/utils/log';

export const getOriginPath = (current_url: string): string => {
  // 定义协议和域名
  let url = current_url?.trim().split('?')[0];
  // 移除首尾的空格并处理不同的 URL格式
  if (url.startsWith('//')) {
    url = `${window.location.protocol}${url}`;
  } else if (url.startsWith('/')) {
    url = `${window.location.origin}${url}`;
  }

  logger('getOriginPath', url);

  try {
    // 提取路径
    return url;
  } catch (error) {
    logger('getOriginPath:error', error);
    throw new Error('Invalid URL format');
  }
  return url;
};
