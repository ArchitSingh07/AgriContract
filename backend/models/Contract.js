import mongoose from 'mongoose';

const contractSchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Listing Type - determines if contract is for farmer's product or buyer's request
  listingType: {
    type: String,
    enum: ['product', 'buyer-request'],
    required: true
  },
  // For contracts from farmer listings
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: function() {
      return this.listingType === 'product';
    }
  },
  // For contracts from buyer listings
  buyerListingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BuyerListing',
    required: function() {
      return this.listingType === 'buyer-request';
    }
  },
  negotiationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Negotiation'
  },
  cropName: {
    type: String,
    required: true
  },
  agreedPrice: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    default: 'kg'
  },
  deliveryDate: {
    type: Date,
    required: true
  },
  deliveryLocation: {
    city: String,
    state: String,
    pincode: String
  },
  terms: {
    type: String,
    default: ''
  },
  paymentTerms: {
    type: String,
    default: 'Upon delivery'
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'completed', 'cancelled'],
    default: 'pending'
  },
  totalValue: {
    type: Number
  },
  signedByFarmer: {
    type: Boolean,
    default: false
  },
  signedByBuyer: {
    type: Boolean,
    default: false
  },
  farmerSignDate: Date,
  buyerSignDate: Date,
  completionDate: Date
}, {
  timestamps: true
});

// Calculate total value before saving
contractSchema.pre('save', function(next) {
  this.totalValue = this.agreedPrice * this.quantity;
  next();
});

const Contract = mongoose.model('Contract', contractSchema);

export default Contract;
