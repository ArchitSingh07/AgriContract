import express from 'express';
import Negotiation from '../models/Negotiation.js';
import Product from '../models/Product.js';
import BuyerListing from '../models/BuyerListing.js';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   POST /api/negotiations/start
// @desc    Start a new negotiation (works for both product and buyer listing)
// @access  Private
router.post('/start', protect, async (req, res) => {
  try {
    const { productId, buyerListingId, farmerId, buyerId, initialMessage, offerDetails } = req.body;
    const currentUserId = req.user._id;

    // Determine listing type and validate
    let listingType;
    let otherPartyId;

    if (productId) {
      // Buyer starting negotiation on farmer's product
      listingType = 'product';
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      otherPartyId = farmerId || product.farmerId;
      
      // Check if negotiation already exists
      let negotiation = await Negotiation.findOne({
        listingType: 'product',
        productId,
        farmerId: otherPartyId,
        buyerId: buyerId || currentUserId
      });

      if (negotiation) {
        // Add message to existing negotiation
        negotiation.messages.push({
          senderId: currentUserId,
          senderType: req.user.role === 'farmer' ? 'farmer' : 'buyer',
          message: initialMessage,
          offerDetails
        });
        negotiation.status = 'active';
        await negotiation.save();
      } else {
        // Create new negotiation
        negotiation = new Negotiation({
          listingType: 'product',
          productId,
          farmerId: otherPartyId,
          buyerId: buyerId || currentUserId,
          messages: [{
            senderId: currentUserId,
            senderType: req.user.role === 'farmer' ? 'farmer' : 'buyer',
            message: initialMessage,
            offerDetails
          }]
        });
        await negotiation.save();
      }

      await negotiation.populate('farmerId', 'name email');
      await negotiation.populate('buyerId', 'name email');
      await negotiation.populate('productId', 'name pricePerUnit imageUrl');

      return res.status(201).json({
        success: true,
        negotiation
      });
    } else if (buyerListingId) {
      // Farmer starting negotiation on buyer's listing
      listingType = 'buyer-request';
      const buyerListing = await BuyerListing.findById(buyerListingId);
      if (!buyerListing) {
        return res.status(404).json({ message: 'Buyer listing not found' });
      }
      otherPartyId = buyerId || buyerListing.buyerId;
      
      // Check if negotiation already exists
      let negotiation = await Negotiation.findOne({
        listingType: 'buyer-request',
        buyerListingId,
        farmerId: farmerId || currentUserId,
        buyerId: otherPartyId
      });

      if (negotiation) {
        // Add message to existing negotiation
        negotiation.messages.push({
          senderId: currentUserId,
          senderType: req.user.role === 'farmer' ? 'farmer' : 'buyer',
          message: initialMessage,
          offerDetails
        });
        negotiation.status = 'active';
        await negotiation.save();
      } else {
        // Create new negotiation
        negotiation = new Negotiation({
          listingType: 'buyer-request',
          buyerListingId,
          farmerId: farmerId || currentUserId,
          buyerId: otherPartyId,
          messages: [{
            senderId: currentUserId,
            senderType: req.user.role === 'farmer' ? 'farmer' : 'buyer',
            message: initialMessage,
            offerDetails
          }]
        });
        await negotiation.save();
      }

      await negotiation.populate('farmerId', 'name email');
      await negotiation.populate('buyerId', 'name email');
      await negotiation.populate('buyerListingId', 'cropName preferredPrice deliveryLocation');

      return res.status(201).json({
        success: true,
        negotiation
      });
    } else {
      return res.status(400).json({ 
        message: 'Either productId or buyerListingId is required' 
      });
    }
  } catch (error) {
    console.error('Error starting negotiation:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/negotiations/message
// @desc    Send a message in negotiation (works for both types)
// @access  Private
router.post('/message', protect, async (req, res) => {
  try {
    const { negotiationId, message, offerDetails } = req.body;
    const userId = req.user._id;

    const negotiation = await Negotiation.findById(negotiationId);
    if (!negotiation) {
      return res.status(404).json({ message: 'Negotiation not found' });
    }

    // Determine sender type
    let senderType;
    if (negotiation.farmerId.toString() === userId.toString()) {
      senderType = 'farmer';
    } else if (negotiation.buyerId.toString() === userId.toString()) {
      senderType = 'buyer';
    } else {
      return res.status(403).json({ message: 'Not authorized to participate in this negotiation' });
    }

    // Add message
    negotiation.messages.push({
      senderId: userId,
      senderType,
      message,
      offerDetails
    });

    await negotiation.save();
    await negotiation.populate('farmerId', 'name email');
    await negotiation.populate('buyerId', 'name email');
    
    // Populate the appropriate listing
    if (negotiation.listingType === 'product') {
      await negotiation.populate('productId', 'name pricePerUnit imageUrl');
    } else {
      await negotiation.populate('buyerListingId', 'cropName preferredPrice deliveryLocation');
    }

    res.json({
      success: true,
      negotiation
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/negotiations/product/:productId
// @desc    Get all negotiations for a product
// @access  Private
router.get('/product/:productId', protect, async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    const negotiations = await Negotiation.find({
      listingType: 'product',
      productId,
      $or: [
        { farmerId: userId },
        { buyerId: userId }
      ]
    })
      .populate('farmerId', 'name email')
      .populate('buyerId', 'name email')
      .populate('productId', 'name pricePerUnit imageUrl')
      .sort('-lastActivity');

    res.json({
      success: true,
      negotiations
    });
  } catch (error) {
    console.error('Error fetching negotiations:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/negotiations/buyer-listing/:buyerListingId
// @desc    Get all negotiations for a buyer listing
// @access  Private
router.get('/buyer-listing/:buyerListingId', protect, async (req, res) => {
  try {
    const { buyerListingId } = req.params;
    const userId = req.user._id;

    const negotiations = await Negotiation.find({
      listingType: 'buyer-request',
      buyerListingId,
      $or: [
        { farmerId: userId },
        { buyerId: userId }
      ]
    })
      .populate('farmerId', 'name email rating')
      .populate('buyerId', 'name email rating')
      .populate('buyerListingId', 'cropName preferredPrice deliveryLocation quantity')
      .sort('-lastActivity');

    res.json({
      success: true,
      negotiations
    });
  } catch (error) {
    console.error('Error fetching buyer listing negotiations:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/negotiations/:id
// @desc    Get single negotiation by ID (works for both types)
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const negotiation = await Negotiation.findById(req.params.id)
      .populate('farmerId', 'name email rating')
      .populate('buyerId', 'name email rating');

    if (!negotiation) {
      return res.status(404).json({ message: 'Negotiation not found' });
    }

    // Populate the appropriate listing
    if (negotiation.listingType === 'product') {
      await negotiation.populate('productId', 'name pricePerUnit imageUrl description quantity unit');
    } else {
      await negotiation.populate('buyerListingId', 'cropName preferredPrice deliveryLocation description quantity unit');
    }

    // Check authorization
    const userId = req.user._id.toString();
    if (negotiation.farmerId._id.toString() !== userId && 
        negotiation.buyerId._id.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to view this negotiation' });
    }

    res.json({
      success: true,
      negotiation
    });
  } catch (error) {
    console.error('Error fetching negotiation:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/negotiations/farmer/:farmerId
// @desc    Get all negotiations for a farmer
// @access  Private
router.get('/farmer/:farmerId', protect, async (req, res) => {
  try {
    const { farmerId } = req.params;

    // Verify user is requesting their own negotiations
    if (req.user._id.toString() !== farmerId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const negotiations = await Negotiation.find({ farmerId })
      .populate('farmerId', 'name email')
      .populate('buyerId', 'name email')
      .populate('productId', 'name price image')
      .sort('-lastActivity');

    res.json({
      success: true,
      negotiations
    });
  } catch (error) {
    console.error('Error fetching farmer negotiations:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/negotiations/:id/status
// @desc    Update negotiation status
// @access  Private
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const negotiation = await Negotiation.findById(req.params.id);

    if (!negotiation) {
      return res.status(404).json({ message: 'Negotiation not found' });
    }

    // Check authorization
    const userId = req.user._id.toString();
    if (negotiation.farmerId.toString() !== userId && 
        negotiation.buyerId.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    negotiation.status = status;
    await negotiation.save();

    res.json({
      success: true,
      negotiation
    });
  } catch (error) {
    console.error('Error updating negotiation status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
