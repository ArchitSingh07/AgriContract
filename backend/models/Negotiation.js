import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  senderType: {
    type: String,
    enum: ['farmer', 'buyer'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  offerDetails: {
    price: Number,
    quantity: Number,
    deliveryDate: Date,
    terms: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const negotiationSchema = new mongoose.Schema({
  // Listing Type - determines if this is about a farmer's product or buyer's request
  listingType: {
    type: String,
    enum: ['product', 'buyer-request'],
    required: true
  },
  // For farmer listings (when buyer initiates negotiation)
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: function() {
      return this.listingType === 'product';
    }
  },
  // For buyer listings (when farmer initiates negotiation)
  buyerListingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BuyerListing',
    required: function() {
      return this.listingType === 'buyer-request';
    }
  },
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
  messages: [messageSchema],
  status: {
    type: String,
    enum: ['active', 'accepted', 'rejected', 'finalized'],
    default: 'active'
  },
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update lastActivity on new message
negotiationSchema.pre('save', function(next) {
  this.lastActivity = Date.now();
  next();
});

const Negotiation = mongoose.model('Negotiation', negotiationSchema);

export default Negotiation;
