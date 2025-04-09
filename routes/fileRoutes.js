const express = require('express');
const router = express.Router();
const multer = require('multer');
const { parseDXF } = require('../services/parserService');
const { File, Block } = require('../models');
const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Basic multer setup
const upload = multer({ dest: 'uploads/' });

// Debug middleware
router.use((req, res, next) => {
  console.log('Request body:', req.body);
  console.log('Request files:', req.files);
  next();
});

// File upload endpoint
router.post('/upload', (req, res, next) => {
  console.log('Received upload request');
  upload.single('file')(req, res, (err) => {
    if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({ error: err.message });
    }
    
    console.log('File received:', req.file);
    next();
  });
}, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Check file extension
    const ext = path.extname(req.file.originalname).toLowerCase();
    if (ext !== '.dxf') {
      fs.unlinkSync(req.file.path); // Clean up
      return res.status(400).json({ error: 'Only .dxf files are allowed' });
    }

    const fileRecord = await File.create({ filename: req.file.originalname });
    const blocks = parseDXF(req.file.path);

    for (let block of blocks) {
      await Block.create({ ...block, FileId: fileRecord.id });
    }

    res.status(200).json({
      message: 'File processed successfully',
      fileId: fileRecord.id,
      filename: req.file.originalname,
      uploadedFile: req.file
    });
  } catch (err) {
    console.error('Processing error:', err);
    if (req.file) {
      fs.unlinkSync(req.file.path); // Clean up on error
    }
    res.status(500).json({ error: err.message });
  }
});

// Get blocks with pagination
router.get('/blocks', async (req, res) => {
  const { page = 1, limit = 10, name = '' } = req.query;
  const offset = (page - 1) * limit;

  try {
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
  } catch (err) {
    console.error('Error fetching blocks:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get single block
router.get('/blocks/:id', async (req, res) => {
  try {
    const block = await Block.findByPk(req.params.id);
    if (!block) return res.status(404).json({ error: 'Block not found' });
    res.json(block);
  } catch (err) {
    console.error('Error fetching block:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;