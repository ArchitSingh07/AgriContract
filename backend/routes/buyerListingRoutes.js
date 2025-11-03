import express from 'express';
import BuyerListing from '../models/BuyerListing.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   POST /api/buyer-listings
// @desc    Create a new buyer listing
// @access  Private (Buyer only)
router.post('/', protect, async (req, res) => {
  try {
    console.log('Creating buyer listing for user:', req.user.id);
    console.log('User role:', req.user.role);
    
    // Verify user is a buyer
    if (req.user.role !== 'Buyer') {
      return res.status(403).json({ 
        message: 'Only buyers can create buyer listings' 
      });
    }

    const {
      cropName,
      category,
      quantity,
      unit,
      preferredPrice,
      preferredPriceUnit,
      deliveryLocation,
      preferredDeliveryDate,
      description,
      qualityRequirements,
      images
    } = req.body;

    // Validate required fields
    if (!cropName || !category || !quantity || !preferredPrice || !deliveryLocation || !preferredDeliveryDate) {
      return res.status(400).json({ 
        message: 'Missing required fields' 
      });
    }

    const buyerListing = new BuyerListing({
      buyerId: req.user.id,
      cropName,
      category,
      quantity,
      unit: unit || 'kg',
      preferredPrice,
      preferredPriceUnit: preferredPriceUnit || 'per kg',
      deliveryLocation,
      preferredDeliveryDate,
      description,
      qualityRequirements,
      images: images || []
    });

    await buyerListing.save();
    
    // Populate buyer details
    await buyerListing.populate('buyerId', 'name email phoneNumber rating');

    console.log('Buyer listing created successfully:', buyerListing._id);
    
    res.status(201).json(buyerListing);
  } catch (error) {
    console.error('Error creating buyer listing:', error);
    res.status(500).json({ 
      message: 'Failed to create buyer listing', 
      error: error.message 
    });
  }
});

// @route   GET /api/buyer-listings
// @desc    Get all buyer listings with filtering
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      category,
      cropName,
      city,
      state,
      minPrice,
      maxPrice,
      minRating,
      status,
      sortBy,
      sortOrder
    } = req.query;

    // Build filter object
    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (cropName) {
      filter.cropName = { $regex: cropName, $options: 'i' };
    }

    if (city) {
      filter['deliveryLocation.city'] = { $regex: city, $options: 'i' };
    }

    if (state) {
      filter['deliveryLocation.state'] = { $regex: state, $options: 'i' };
    }

    if (minPrice) {
      filter.preferredPrice = { ...filter.preferredPrice, $gte: parseFloat(minPrice) };
    }

    if (maxPrice) {
      filter.preferredPrice = { ...filter.preferredPrice, $lte: parseFloat(maxPrice) };
    }

    if (status) {
      filter.status = status;
    } else {
      // By default, only show active listings
      filter.status = 'active';
    }

    // Build sort object
    let sort = { createdAt: -1 }; // Default: newest first

    if (sortBy === 'price') {
      sort = { preferredPrice: sortOrder === 'desc' ? -1 : 1 };
    } else if (sortBy === 'quantity') {
      sort = { quantity: sortOrder === 'desc' ? -1 : 1 };
    } else if (sortBy === 'date') {
      sort = { preferredDeliveryDate: sortOrder === 'desc' ? -1 : 1 };
    }

    const listings = await BuyerListing.find(filter)
      .populate('buyerId', 'name email phoneNumber rating reviewCount')
      .sort(sort);

    // Filter by buyer rating if specified (post-query filtering)
    let filteredListings = listings;
    if (minRating) {
      filteredListings = listings.filter(listing => 
        listing.buyerId && listing.buyerId.rating >= parseFloat(minRating)
      );
    }

    console.log(`Found ${filteredListings.length} buyer listings`);
    
    res.json(filteredListings);
  } catch (error) {
    console.error('Error fetching buyer listings:', error);
    res.status(500).json({ 
      message: 'Failed to fetch buyer listings', 
      error: error.message 
    });
  }
});

// @route   GET /api/buyer-listings/my-listings
// @desc    Get buyer's own listings
// @access  Private (Buyer only)
router.get('/my-listings', protect, async (req, res) => {
  try {
    console.log('Fetching listings for buyer:', req.user.id);
    
    const listings = await BuyerListing.find({ buyerId: req.user.id })
      .populate('buyerId', 'name email phoneNumber rating')
      .populate('offers.farmerId', 'name email phoneNumber rating')
      .sort({ createdAt: -1 });

    console.log(`Found ${listings.length} listings for buyer`);
    
    res.json(listings);
  } catch (error) {
    console.error('Error fetching buyer listings:', error);
    res.status(500).json({ 
      message: 'Failed to fetch your listings', 
      error: error.message 
    });
  }
});

// @route   GET /api/buyer-listings/:id
// @desc    Get single buyer listing by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const listing = await BuyerListing.findById(req.params.id)
      .populate('buyerId', 'name email phoneNumber rating reviewCount')
      .populate('offers.farmerId', 'name email phoneNumber rating');

    if (!listing) {
      return res.status(404).json({ message: 'Buyer listing not found' });
    }

    // Increment view count
    listing.viewCount += 1;
    await listing.save();

    console.log('Fetched buyer listing:', listing._id);
    
    res.json(listing);
  } catch (error) {
    console.error('Error fetching buyer listing:', error);
    res.status(500).json({ 
      message: 'Failed to fetch buyer listing', 
      error: error.message 
    });
  }
});

// @route   PUT /api/buyer-listings/:id
// @desc    Update buyer listing
// @access  Private (Buyer - owner only)
router.put('/:id', protect, async (req, res) => {
  try {
    const listing = await BuyerListing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Buyer listing not found' });
    }

    // Check if user is the owner
    if (listing.buyerId.toString() !== req.user.id) {
      return res.status(403).json({ 
        message: 'You can only update your own listings' 
      });
    }

    const {
      cropName,
      category,
      quantity,
      unit,
      preferredPrice,
      preferredPriceUnit,
      deliveryLocation,
      preferredDeliveryDate,
      description,
      qualityRequirements,
      status,
      images
    } = req.body;

    // Update fields
    if (cropName) listing.cropName = cropName;
    if (category) listing.category = category;
    if (quantity) listing.quantity = quantity;
    if (unit) listing.unit = unit;
    if (preferredPrice) listing.preferredPrice = preferredPrice;
    if (preferredPriceUnit) listing.preferredPriceUnit = preferredPriceUnit;
    if (deliveryLocation) listing.deliveryLocation = deliveryLocation;
    if (preferredDeliveryDate) listing.preferredDeliveryDate = preferredDeliveryDate;
    if (description !== undefined) listing.description = description;
    if (qualityRequirements !== undefined) listing.qualityRequirements = qualityRequirements;
    if (status) listing.status = status;
    if (images) listing.images = images;

    await listing.save();
    await listing.populate('buyerId', 'name email phoneNumber rating');

    console.log('Updated buyer listing:', listing._id);
    
    res.json(listing);
  } catch (error) {
    console.error('Error updating buyer listing:', error);
    res.status(500).json({ 
      message: 'Failed to update buyer listing', 
      error: error.message 
    });
  }
});

// @route   DELETE /api/buyer-listings/:id
// @desc    Delete buyer listing
// @access  Private (Buyer - owner only)
router.delete('/:id', protect, async (req, res) => {
  try {
    console.log('Attempting to delete buyer listing:', req.params.id);
    console.log('User ID:', req.user.id);

    const listing = await BuyerListing.findById(req.params.id);

    if (!listing) {
      console.log('Buyer listing not found');
      return res.status(404).json({ message: 'Buyer listing not found' });
    }

    console.log('Listing buyerId:', listing.buyerId.toString());
    
    // Check if user is the owner
    if (listing.buyerId.toString() !== req.user.id) {
      console.log('User is not the owner');
      return res.status(403).json({ 
        message: 'You can only delete your own listings' 
      });
    }

    await BuyerListing.findByIdAndDelete(req.params.id);

    console.log('Buyer listing deleted successfully');
    
    res.json({ message: 'Buyer listing deleted successfully' });
  } catch (error) {
    console.error('Error deleting buyer listing:', error);
    res.status(500).json({ 
      message: 'Failed to delete buyer listing', 
      error: error.message 
    });
  }
});

// @route   POST /api/buyer-listings/:id/offer
// @desc    Add offer from farmer to buyer listing
// @access  Private (Farmer only)
router.post('/:id/offer', protect, async (req, res) => {
  try {
    console.log('Adding offer to buyer listing:', req.params.id);
    console.log('User role:', req.user.role);
    
    // Verify user is a farmer
    if (req.user.role !== 'Farmer') {
      return res.status(403).json({ 
        message: 'Only farmers can make offers on buyer listings' 
      });
    }

    const listing = await BuyerListing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Buyer listing not found' });
    }

    const { offeredPrice, offeredQuantity, proposedDate, message } = req.body;

    if (!offeredPrice || !offeredQuantity) {
      return res.status(400).json({ 
        message: 'Offered price and quantity are required' 
      });
    }

    // Add offer to listing
    listing.offers.push({
      farmerId: req.user.id,
      offeredPrice,
      offeredQuantity,
      proposedDate,
      message,
      status: 'pending'
    });

    listing.offerCount += 1;
    listing.status = 'in-negotiation';

    await listing.save();
    await listing.populate('offers.farmerId', 'name email phoneNumber rating');

    console.log('Offer added successfully');
    
    res.json(listing);
  } catch (error) {
    console.error('Error adding offer:', error);
    res.status(500).json({ 
      message: 'Failed to add offer', 
      error: error.message 
    });
  }
});

export default router;
