import asyncHandler from 'express-async-handler';
import Size from '../models/sizeModel.js';

// @desc    Get all sizes
// @route   GET /api/sizes
// @access  Public
export const getSizes = asyncHandler(async (req, res) => {
  const sizes = await Size.find({});
  // We'll let frontend handle custom sorting if needed, or return as created
  res.json({ success: true, sizes });
});

// @desc    Create a size
// @route   POST /api/sizes
// @access  Private/Admin
export const createSize = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const sizeExists = await Size.findOne({ name });
  if (sizeExists) {
    res.status(400);
    throw new Error('Size already exists');
  }

  const size = await Size.create({ name });
  res.status(201).json({ success: true, size });
});

// @desc    Update a size
// @route   PUT /api/sizes/:id
// @access  Private/Admin
export const updateSize = asyncHandler(async (req, res) => {
  const size = await Size.findById(req.params.id);

  if (size) {
    size.name = req.body.name || size.name;
    const updatedSize = await size.save();
    res.json({ success: true, size: updatedSize });
  } else {
    res.status(404);
    throw new Error('Size not found');
  }
});

// @desc    Delete a size
// @route   DELETE /api/sizes/:id
// @access  Private/Admin
export const deleteSize = asyncHandler(async (req, res) => {
  const size = await Size.findById(req.params.id);

  if (size) {
    await size.deleteOne();
    res.json({ success: true, message: 'Size removed' });
  } else {
    res.status(404);
    throw new Error('Size not found');
  }
});
