import express from 'express';
import Contract from '../models/Contract.js';
import Negotiation from '../models/Negotiation.js';
import Product from '../models/Product.js';
import BuyerListing from '../models/BuyerListing.js';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   POST /api/contracts/create
// @desc    Create a finalized contract (works for both product and buyer listing)
// @access  Private
router.post('/create', protect, async (req, res) => {
  try {
    const {
      farmerId,
      buyerId,
      productId,
      buyerListingId,
      negotiationId,
      cropName,
      agreedPrice,
      quantity,
      unit,
      deliveryDate,
      deliveryLocation,
      terms,
      paymentTerms
    } = req.body;

    // Determine listing type and validate
    let listingType;
    let listing;

    if (productId) {
      listingType = 'product';
      listing = await Product.findById(productId);
      if (!listing) {
        return res.status(404).json({ message: 'Product not found' });
      }
    } else if (buyerListingId) {
      listingType = 'buyer-request';
      listing = await BuyerListing.findById(buyerListingId);
      if (!listing) {
        return res.status(404).json({ message: 'Buyer listing not found' });
      }
    } else {
      return res.status(400).json({ message: 'Either productId or buyerListingId is required' });
    }

    const farmer = await User.findById(farmerId);
    const buyer = await User.findById(buyerId);
    
    if (!farmer || !buyer) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify authorization (either farmer or buyer can create)
    const userId = req.user._id.toString();
    if (userId !== farmerId && userId !== buyerId) {
      return res.status(403).json({ message: 'Not authorized to create this contract' });
    }

    // Create contract
    const contract = new Contract({
      farmerId,
      buyerId,
      listingType,
      productId: listingType === 'product' ? productId : undefined,
      buyerListingId: listingType === 'buyer-request' ? buyerListingId : undefined,
      negotiationId,
      cropName: cropName || (listingType === 'product' ? listing.name : listing.cropName),
      agreedPrice,
      quantity,
      unit: unit || 'kg',
      deliveryDate,
      deliveryLocation: deliveryLocation || (listingType === 'buyer-request' ? listing.deliveryLocation : undefined),
      terms,
      paymentTerms: paymentTerms || 'Upon delivery'
    });

    // Auto-sign for the creator
    if (userId === farmerId) {
      contract.signedByFarmer = true;
      contract.farmerSignDate = Date.now();
    } else if (userId === buyerId) {
      contract.signedByBuyer = true;
      contract.buyerSignDate = Date.now();
    }

    // If both signed, mark as active
    if (contract.signedByFarmer && contract.signedByBuyer) {
      contract.status = 'active';
    }

    await contract.save();

    // Update negotiation status if exists
    if (negotiationId) {
      await Negotiation.findByIdAndUpdate(negotiationId, {
        status: 'finalized'
      });
    }

    // Update listing status
    if (listingType === 'product') {
      await Product.findByIdAndUpdate(productId, { status: 'contracted' });
    } else {
      await BuyerListing.findByIdAndUpdate(buyerListingId, { status: 'contracted' });
    }

    // Populate for response
    await contract.populate('farmerId', 'name email phoneNumber');
    await contract.populate('buyerId', 'name email phoneNumber');
    
    if (listingType === 'product') {
      await contract.populate('productId', 'name pricePerUnit imageUrl description');
    } else {
      await contract.populate('buyerListingId', 'cropName preferredPrice deliveryLocation description');
    }

    res.status(201).json({
      success: true,
      contract
    });
  } catch (error) {
    console.error('Error creating contract:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/contracts/farmer/:id
// @desc    Get all contracts for a farmer (both types)
// @access  Private
router.get('/farmer/:id', protect, async (req, res) => {
  try {
    const farmerId = req.params.id;

    // Verify user is requesting their own contracts
    if (req.user._id.toString() !== farmerId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const contracts = await Contract.find({ farmerId })
      .populate('farmerId', 'name email phoneNumber')
      .populate('buyerId', 'name email phoneNumber')
      .sort('-createdAt');

    // Populate the appropriate listing for each contract
    for (const contract of contracts) {
      if (contract.listingType === 'product') {
        await contract.populate('productId', 'name pricePerUnit imageUrl description');
      } else {
        await contract.populate('buyerListingId', 'cropName preferredPrice deliveryLocation description');
      }
    }

    res.json({
      success: true,
      contracts
    });
  } catch (error) {
    console.error('Error fetching farmer contracts:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/contracts/buyer/:id
// @desc    Get all contracts for a buyer (both types)
// @access  Private
router.get('/buyer/:id', protect, async (req, res) => {
  try {
    const buyerId = req.params.id;

    // Verify user is requesting their own contracts
    if (req.user._id.toString() !== buyerId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const contracts = await Contract.find({ buyerId })
      .populate('farmerId', 'name email phoneNumber')
      .populate('buyerId', 'name email phoneNumber')
      .sort('-createdAt');

    // Populate the appropriate listing for each contract
    for (const contract of contracts) {
      if (contract.listingType === 'product') {
        await contract.populate('productId', 'name pricePerUnit imageUrl description');
      } else {
        await contract.populate('buyerListingId', 'cropName preferredPrice deliveryLocation description');
      }
    }

    res.json({
      success: true,
      contracts
    });
  } catch (error) {
    console.error('Error fetching buyer contracts:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/contracts/:id
// @desc    Get single contract details (works for both types)
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id)
      .populate('farmerId', 'name email phoneNumber address')
      .populate('buyerId', 'name email phoneNumber address');

    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    // Populate the appropriate listing
    if (contract.listingType === 'product') {
      await contract.populate('productId', 'name pricePerUnit imageUrl description type');
    } else {
      await contract.populate('buyerListingId', 'cropName preferredPrice deliveryLocation description category');
    }

    // Check authorization
    const userId = req.user._id.toString();
    if (contract.farmerId._id.toString() !== userId && 
        contract.buyerId._id.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to view this contract' });
    }

    res.json({
      success: true,
      contract
    });
  } catch (error) {
    console.error('Error fetching contract:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/contracts/:id/sign
// @desc    Sign a contract (works for both types)
// @access  Private
router.put('/:id/sign', protect, async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id);

    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    const userId = req.user._id.toString();

    // Sign the contract
    if (contract.farmerId.toString() === userId) {
      contract.signedByFarmer = true;
      contract.farmerSignDate = Date.now();
    } else if (contract.buyerId.toString() === userId) {
      contract.signedByBuyer = true;
      contract.buyerSignDate = Date.now();
    } else {
      return res.status(403).json({ message: 'Not authorized to sign this contract' });
    }

    // If both signed, mark as active
    if (contract.signedByFarmer && contract.signedByBuyer) {
      contract.status = 'active';
    }

    await contract.save();

    await contract.populate('farmerId', 'name email phoneNumber');
    await contract.populate('buyerId', 'name email phoneNumber');
    
    if (contract.listingType === 'product') {
      await contract.populate('productId', 'name pricePerUnit imageUrl');
    } else {
      await contract.populate('buyerListingId', 'cropName preferredPrice deliveryLocation');
    }

    res.json({
      success: true,
      contract
    });
  } catch (error) {
    console.error('Error signing contract:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/contracts/:id/status
// @desc    Update contract status
// @access  Private
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const contract = await Contract.findById(req.params.id);

    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    // Check authorization
    const userId = req.user._id.toString();
    if (contract.farmerId.toString() !== userId && 
        contract.buyerId.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    contract.status = status;
    
    if (status === 'completed') {
      contract.completionDate = Date.now();
    }

    await contract.save();

    res.json({
      success: true,
      contract
    });
  } catch (error) {
    console.error('Error updating contract status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/contracts/stats/:userId
// @desc    Get contract statistics for a user
// @access  Private
router.get('/stats/:userId', protect, async (req, res) => {
  try {
    const userId = req.params.userId;

    // Verify user is requesting their own stats
    if (req.user._id.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let query;
    if (user.userType === 'farmer') {
      query = { farmerId: userId };
    } else {
      query = { buyerId: userId };
    }

    const totalContracts = await Contract.countDocuments(query);
    const activeContracts = await Contract.countDocuments({ ...query, status: 'active' });
    const pendingContracts = await Contract.countDocuments({ ...query, status: 'pending' });
    const completedContracts = await Contract.countDocuments({ ...query, status: 'completed' });

    // Calculate total revenue (for farmers) or spending (for buyers)
    const contracts = await Contract.find({ ...query, status: { $in: ['active', 'completed'] } });
    const totalValue = contracts.reduce((sum, contract) => sum + (contract.totalValue || 0), 0);

    res.json({
      success: true,
      stats: {
        totalContracts,
        activeContracts,
        pendingContracts,
        completedContracts,
        totalValue
      }
    });
  } catch (error) {
    console.error('Error fetching contract stats:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
