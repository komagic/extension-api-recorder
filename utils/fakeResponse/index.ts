import faker from 'faker-zh-cn';
type JsonType = Array<JsonType> | Record<string, unknown> | string | number | boolean | null | undefined;

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

function generateFakeResponse(response: JsonType, language = 'zh_CN'): JsonType | string {
  const type = Object.prototype.toString.call(response);
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
      return (response as JsonType[]).map((item: JsonType) => generateFakeResponse(item));

    case '[object String]': {
      const isNumberString = /^\d+$/.test((response as string)); // 判断是否为数字字符串
      if (isNumberString) {
        return faker.random.number((response as string)?.length) + ''; // 生成一个随机的数字
      }
      if ((response as string).includes('"http')) {
        return response; // 生成一个随机的图片链接
      } else {
        if ((response as string)?.length < 4) {
          return faker.Name.findName();
        } else {
          return faker.Lorem.sentence(); // 返回随机句子
        }
      }
    }
    case '[object Number]':
      return faker.Helpers.randomNumber();

    case '[object Boolean]':
      return Math.random() < 0.8;

    case '[object Null]':
      return null;

    case '[object Undefined]':
      return null;

    default:
      return response; // 原样返回不支持的类型
  }
}

export default generateFakeResponse;
