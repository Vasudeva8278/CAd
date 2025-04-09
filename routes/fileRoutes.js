// routes/fileRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { parseDXF } = require('../services/parserService');
const { File, Block } = require('../models');

const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const fileRecord = await File.create({ filename: req.file.originalname });
    const blocks = parseDXF(req.file.path);

    for (let block of blocks) {
      await Block.create({ ...block, FileId: fileRecord.id });
    }

    res.status(200).json({ message: 'File processed', fileId: fileRecord.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/blocks', async (req, res) => {
    const { page = 1, limit = 10, name = '' } = req.query;
    const offset = (page - 1) * limit;
  
    const blocks = await Block.findAndCountAll({
      where: { name: { [Op.iLike]: `%${name}%` } },
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
  
    res.json({
      total: blocks.count,
      pages: Math.ceil(blocks.count / limit),
      data: blocks.rows,
    });
  });
  

  router.get('/blocks/:id', async (req, res) => {
    const block = await Block.findByPk(req.params.id);
    if (!block) return res.status(404).json({ error: 'Block not found' });
    res.json(block);
  });
  