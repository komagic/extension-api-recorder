export const matchesAnyRule = (str: string, rules: (string | RegExp)[]) => {
  const input = str?.trim();
  if (input === '') {
    return false;
  }
  console.log('matchesAnyRule',rules,str);
  
  if(!rules) return false;
  return rules.some(pattern => {
    if (typeof pattern === 'string') {
      // 检查字符串是否是正则表达式格式 (即以斜杠开头和结尾)
      const regexPattern = pattern.match(/^\/(.*)\/$/);
      if (regexPattern) {
        // 如果是正则表达式格式，转换为真正的正则表达式
        const regex = new RegExp(regexPattern[1]);
        return regex.test(input);
      } else {
        // 否则按字符串处理
        return input.includes(pattern);
      }
    } else if (pattern instanceof RegExp) {
      return pattern.test(input);
    }
    return false;
  });
};
