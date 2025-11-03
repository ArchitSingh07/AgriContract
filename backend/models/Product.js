import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Farmer ID is required'],
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [100, 'Product name cannot exceed 100 characters'],
    },
    type: {
      type: String,
      required: [true, 'Product type is required'],
      trim: true,
      maxlength: [50, 'Product type cannot exceed 50 characters'],
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
    },
    unit: {
      type: String,
      required: [true, 'Unit is required'],
      enum: {
        values: ['kg', 'quintal', 'ton', 'bags', 'crates', 'boxes', 'pieces'],
        message: 'Unit must be one of: kg, quintal, ton, bags, crates, boxes, pieces',
      },
    },
    pricePerUnit: {
      type: Number,
      required: [true, 'Price per unit is required'],
      min: [0, 'Price cannot be negative'],
    },
    harvestDate: {
      type: Date,
      required: [true, 'Harvest date is required'],
    },
    imageUrl: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Index for faster queries
productSchema.index({ farmerId: 1, createdAt: -1 });
productSchema.index({ type: 1 });

const Product = mongoose.model('Product', productSchema);

export default Product;
