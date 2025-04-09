const File = require('./file');
const Block = require('./block');

// Define association
File.hasMany(Block, { onDelete: 'CASCADE' });
Block.belongsTo(File);

module.exports = { File, Block };
