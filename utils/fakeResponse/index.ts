import faker from 'faker';
faker.locales = 'zh_CN';
type JsonType = Record<string, unknown> | string | number | boolean | null | undefined;

// async function checkImage(url): Promise<boolean> {
//   try {
//     const img = new Image();
//     img.src = url;
//     await new Promise(resolve => {
//       img.onload = () => resolve(true);
//       img.onerror = () => resolve(false);
//     });
//     return true;
//   } catch (error) {
//     return false;
//   }
// }
// async function isImageUrl(url: string): boolean {
//   // 先检查扩展名
//   const isImage = /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(url);

//   if (isImage) return true;

//   // 发送 HEAD 请求获取 MIME 类型
//   const response = await fetch(url, { method: 'HEAD' });
//   const contentType = response.headers.get('Content-Type');
//   if (contentType && contentType.startsWith('image/')) {
//     return true;
//   }

//   const res = await checkImage(url);
//   // 最后，尝试加载图片
//   return res;
// }

function generateFakeResponse(response: JsonType, language = 'zh_CN'): JsonType {
  const type = Object.prototype.toString.call(response);
  // 设置 faker 的语言
  faker.locale = language;
  switch (type) {
    case '[object Object]':
      return Object.entries(response).reduce(
        (acc, [key, value]) => {
          acc[key] = generateFakeResponse(value);
          return acc;
        },
        {} as Record<string, JsonType>,
      );

    case '[object Array]':
      return response.map(item => generateFakeResponse(item));

    case '[object String]':
      if ((response as string).includes('"http')) {
        return response; // 生成一个随机的图片链接
      } else {
        return faker.lorem.sentences(1); // 返回随机句子
      }

    case '[object Number]':
      return faker.datatype.number();

    case '[object Boolean]':
      return faker.datatype.boolean();

    case '[object Null]':
      return null;

    case '[object Undefined]':
      return null;

    default:
      return response; // 原样返回不支持的类型
  }
}

export default generateFakeResponse;
