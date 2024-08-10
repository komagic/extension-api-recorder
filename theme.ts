const maxWidth = 750;
const spacing = {};
for (let i = 0; i <= maxWidth; i++) {
  spacing[i] = `${i}px`;
}
const fontSize = {};
for (let i = 12; i <= 100; i++) {
  // 这里同时设置了1.2倍的行高
  fontSize[i] = [`${i}px`, `${i * 1.2}px`];
}
const borderRadius = {};
for (let i = 1; i <= 750 / 2; i++) {
  // 这里同时设置了1.2倍的行高
  borderRadius[i] = `${i}px`;
}

export const theme_extend = {
  // 适用 padding, margin, width, height, min-xxx ,max-xxx等
  spacing,
  // 适用 font-size
  fontSize,
  // 适用 border-radius
  borderRadius,
  // 适用 color, background-color, border-color
  colors: {},
};
