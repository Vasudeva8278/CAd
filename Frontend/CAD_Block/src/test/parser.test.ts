// tests/parser.test.ts
import { parseDXF } from '../services/parserService';

describe('parseDXF', () => {
  it('parses DXF correctly', () => {
    const blocks = parseDXF('tests/sample.dxf');
    expect(Array.isArray(blocks)).toBe(true);
    expect(blocks.length).toBeGreaterThan(0);
  });
});
