import express from 'express';
import Product from '../models/Product.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   POST /api/products
// @desc    Create a new product (Farmer only)
// @access  Private (Farmer)
router.post('/', protect, authorize('Farmer'), async (req, res) => {
  try {
    const {
      name,
      type,
      description,
      location,
      quantity,
      unit,
      pricePerUnit,
      harvestDate,
      imageUrl,
    } = req.body;

    // Validate required fields
    if (!name || !type || !description || !location || !quantity || !unit || !pricePerUnit || !harvestDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, type, description, location, quantity, unit, pricePerUnit, harvestDate',
      });
    }

    // Create product with logged-in farmer's ID
    const product = await Product.create({
      farmerId: req.user.id,
      name,
      type,
      description,
      location,
      quantity,
      unit,
      pricePerUnit,
      harvestDate,
      imageUrl: imageUrl || '',
    });

    // Populate farmer details
    await product.populate('farmerId', 'name email location');

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product,
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating product',
      error: error.message,
    });
  }
});

// @route   GET /api/products
// @desc    Get all products with filtering
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      type,
      name,
      location,
      minPrice,
      maxPrice,
      minRating,
      sortBy,
      sortOrder
    } = req.query;

    // Build filter object
    const filter = {};

    if (type) {
      filter.type = { $regex: type, $options: 'i' };
    }

    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }

    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    if (minPrice) {
      filter.pricePerUnit = { ...filter.pricePerUnit, $gte: parseFloat(minPrice) };
    }

    if (maxPrice) {
      filter.pricePerUnit = { ...filter.pricePerUnit, $lte: parseFloat(maxPrice) };
    }

    // Build sort object
    let sort = { createdAt: -1 }; // Default: newest first

    if (sortBy === 'price') {
      sort = { pricePerUnit: sortOrder === 'desc' ? -1 : 1 };
    } else if (sortBy === 'quantity') {
      sort = { quantity: sortOrder === 'desc' ? -1 : 1 };
    } else if (sortBy === 'date') {
      sort = { harvestDate: sortOrder === 'desc' ? -1 : 1 };
    }

    const products = await Product.find(filter)
      .populate('farmerId', 'name email location rating reviewCount')
      .sort(sort);

    // Filter by farmer rating if specified (post-query filtering)
    let filteredProducts = products;
    if (minRating) {
      filteredProducts = products.filter(product => 
        product.farmerId && product.farmerId.rating >= parseFloat(minRating)
      );
    }

    res.status(200).json({
      success: true,
      count: filteredProducts.length,
      products: filteredProducts,
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching products',
      error: error.message,
    });
  }
});

// @route   GET /api/products/farmer/:farmerId
// @desc    Get all products by a specific farmer
// @access  Public
router.get('/farmer/:farmerId', async (req, res) => {
  try {
    const products = await Product.find({ farmerId: req.params.farmerId })
      .populate('farmerId', 'name email location')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error('Get farmer products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching farmer products',
      error: error.message,
    });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('farmerId', 'name email location role');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error('Get product error:', error);
    
    // Handle invalid ObjectId format
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while fetching product',
      error: error.message,
    });
  }
});

// @route   PUT /api/products/:id
// @desc    Update product (Farmer only - must own the product)
// @access  Private (Farmer)
router.put('/:id', protect, authorize('Farmer'), async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Check if the logged-in farmer owns this product
    if (product.farmerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this product',
      });
    }

    // Update product
    const {
      name,
      type,
      description,
      location,
      quantity,
      unit,
      pricePerUnit,
      harvestDate,
      imageUrl,
    } = req.body;

    product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: name || product.name,
        type: type || product.type,
        description: description || product.description,
        location: location || product.location,
        quantity: quantity !== undefined ? quantity : product.quantity,
        unit: unit || product.unit,
        pricePerUnit: pricePerUnit !== undefined ? pricePerUnit : product.pricePerUnit,
        harvestDate: harvestDate || product.harvestDate,
        imageUrl: imageUrl !== undefined ? imageUrl : product.imageUrl,
      },
      {
        new: true, // Return updated document
        runValidators: true, // Run schema validators
      }
    ).populate('farmerId', 'name email location');

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product,
    });
  } catch (error) {
    console.error('Update product error:', error);

    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating product',
      error: error.message,
    });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete product (Farmer only - must own the product)
// @access  Private (Farmer)
router.delete('/:id', protect, authorize('Farmer'), async (req, res) => {
  try {
    console.log('Delete request for product ID:', req.params.id);
    console.log('User ID:', req.user.id);
    
    const product = await Product.findById(req.params.id);

    if (!product) {
      console.log('Product not found');
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    console.log('Product farmerId:', product.farmerId.toString());
    
    // Check if the logged-in farmer owns this product
    if (product.farmerId.toString() !== req.user.id) {
      console.log('Authorization failed - user does not own this product');
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this product',
      });
    }

    await Product.findByIdAndDelete(req.params.id);
    console.log('Product deleted successfully');

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Delete product error:', error);

    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while deleting product',
      error: error.message,
    });
  }
});

export default router;
