import { describe, it, expect } from 'vitest';
import generateFakeResponse from './index';

const getType =(s)=>Object.prototype.toString.call(s)

// 测试场景：输入为对象
// describe('generateFakeResponse', () => {
//   it('should generate a fake response for an object', () => {
//     const input = { key1: 'value1', key2: 2 };
//     const output = generateFakeResponse(input);
//     expect(output).toBeInstanceOf(Object);
//     expect(output).toHaveProperty('key1');
//     expect(output).toHaveProperty('key2');
//     expect(output.key1).toBeInstanceOf(String);
//     expect(output.key2).toBeInstanceOf(Number);
//   });
// });

describe('generateFakeResponse', () => {
  it('should generate a fake response for an array', () => {
    const input = ['value1', 2, true];
    const output = generateFakeResponse(input);
    expect(getType(output)).toBe('[object Array]');
    expect(output).toBeInstanceOf(Array);
    expect(output).toHaveLength(input.length);
  });
});

// 测试场景：输入为字符串
describe('generateFakeResponse', () => {
  it('should generate a fake response for a string', () => {
    const input = 'test string';
    const output = generateFakeResponse(input);
    const val = Object.prototype.toString.call(output);
    expect(val).toBe('[object String]');
  });
});

// 测试场景：输入为数字
describe('generateFakeResponse', () => {
  it('should generate a fake response for a number', () => {
    const input = 123;
    const output = generateFakeResponse(input);
    const val = Object.prototype.toString.call(output);
    expect(val).toBe('[object Number]');
  });
});

// 测试场景：输入为布尔值
describe('generateFakeResponse', () => {
  it('should generate a fake response for a boolean', () => {
    const input = true;
    const output = generateFakeResponse(input);
    const val = Object.prototype.toString.call(output);
    console.log('generated response', output);
    expect(val).toBe('[object Boolean]');
  });
});

// 测试场景：输入为null
describe('generateFakeResponse', () => {
  it('should generate a fake response for null', () => {
    const input = null;
    const output = generateFakeResponse(input);
    expect(output).toBe(null);
  });
});

// 测试场景：输入为undefined
describe('generateFakeResponse', () => {
  it('should generate a fake response for undefined', () => {
    const input = undefined;
    const output = generateFakeResponse(input);
    expect(output).toBe(null);
  });
});

// 测试场景：输入为不支持的类型
describe('generateFakeResponse', () => {
  it('should return the input as is for unsupported types', () => {
    const input = Symbol('test');
    //@ts-ignore
    const output = generateFakeResponse(input);
    expect(output).toBe(input);
  });
});