const fs = require('fs');
const Parser = require('dxf-parser');

exports.parseDXF = (filePath) => {
  const parser = new Parser();
  const data = fs.readFileSync(filePath, 'utf-8');
  const dxf = parser.parseSync(data);

  const blocks = dxf.blocks;
  const result = [];

  for (let blockName in blocks) {
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
