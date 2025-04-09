// services/parserService.ts
import fs from 'fs';
import Parser from 'dxf-parser';

interface BlockResult {
  name: string;
  type: string;
  x: number;
  y: number;
  properties: any; // You can define a more specific type if needed
}

export const parseDXF = (filePath: string): BlockResult[] => {
  const parser = new Parser();
  const data = fs.readFileSync(filePath, 'utf-8');
  const dxf = parser.parseSync(data);

  const blocks = dxf.blocks;
  const result: BlockResult[] = [];

  for (const blockName in blocks) {
    const block = blocks[blockName];
    result.push({
      name: blockName,
      type: block.type || 'unknown',
      x: block.basePoint?.x || 0,
      y: block.basePoint?.y || 0,
      properties: block
    });
  }

  return result;
};
