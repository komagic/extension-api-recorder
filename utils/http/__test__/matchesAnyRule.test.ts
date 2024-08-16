import { describe, it, expect } from 'vitest';

import { matchesAnyRule } from '../matchesAnyRule';
// test enable_by_rules
describe('enable_by_rules function', () => {
  it('should return false when rules is empty array', () => {
    const result = matchesAnyRule('https://www.example.com', []);
    expect(result).toEqual(false);
  });

  it('should return true when url contains a matching string in rules', () => {
    const result = matchesAnyRule('https://www.example.com/path', ['path']);
    expect(result).toEqual(true);
  });

  it('should return false when url does not contain any matching strings in rules', () => {
    const result = matchesAnyRule('https://www.example.com/path', ['foo', 'bar']);
    expect(result).toEqual(false);
  });

  it('should return true when url matches a regular expression in rules', () => {
    const result = matchesAnyRule('https://www.example.com/path', ['//path$/']);
    expect(result).toEqual(true);
  });

  it('should return false when url does not match any regular expressions in rules', () => {
    const result = matchesAnyRule('https://www.example.com/path', [/\/foo$/, /\/bar$/]);
    expect(result).toEqual(false);
  });

  it('should match regular expressions correctly', () => {
    const patterns = [/hello/, /world/];
    const input = 'hello world!';
    const results = matchesAnyRule(input, patterns);

    expect(results).toEqual(true);
  });
});
