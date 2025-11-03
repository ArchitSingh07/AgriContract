import mongoose from 'mongoose';

const buyerListingSchema = new mongoose.Schema({
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  cropName: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['vegetables', 'fruits', 'grains', 'pulses', 'spices', 'other'],
    default: 'other'
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    required: true,
    enum: ['kg', 'quintal', 'ton', 'litre', 'dozen', 'piece'],
    default: 'kg'
  },
  preferredPrice: {
    type: Number,
    required: true,
    min: 0
  },
  preferredPriceUnit: {
    type: String,
    required: true,
    enum: ['per kg', 'per quintal', 'per ton', 'per litre', 'per dozen', 'per piece'],
    default: 'per kg'
  },
  deliveryLocation: {
    city: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    pincode: {
      type: String,
      trim: true
    }
  },
  preferredDeliveryDate: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  qualityRequirements: {
    type: String,
    trim: true,
    maxlength: 500
  },
  status: {
    type: String,
    enum: ['active', 'in-negotiation', 'contracted', 'fulfilled', 'cancelled'],
    default: 'active',
    index: true
  },
  images: [{
    type: String // URLs to uploaded images
  }],
  offers: [{
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    offeredPrice: Number,
    offeredQuantity: Number,
    proposedDate: Date,
    message: String,
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'countered'],
      default: 'pending'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  viewCount: {
    type: Number,
    default: 0
  },
  offerCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
buyerListingSchema.index({ category: 1, status: 1 });
buyerListingSchema.index({ 'deliveryLocation.city': 1 });
buyerListingSchema.index({ createdAt: -1 });
buyerListingSchema.index({ preferredPrice: 1 });

// Virtual for buyer details
buyerListingSchema.virtual('buyer', {
  ref: 'User',
  localField: 'buyerId',
  foreignField: '_id',
  justOne: true
});

// Ensure virtuals are included in JSON
buyerListingSchema.set('toJSON', { virtuals: true });
buyerListingSchema.set('toObject', { virtuals: true });

const BuyerListing = mongoose.model('BuyerListing', buyerListingSchema);

export default BuyerListing;
