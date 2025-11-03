import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import buyerListingRoutes from './routes/buyerListingRoutes.js';
import negotiationRoutes from './routes/negotiationRoutes.js';
import contractRoutes from './routes/contractRoutes.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request body
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/buyer-listings', buyerListingRoutes);
app.use('/api/negotiations', negotiationRoutes);
app.use('/api/contracts', contractRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'CropContract API is running',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        getUser: 'GET /api/auth/me (Protected)',
      },
      products: {
        create: 'POST /api/products (Farmer only)',
        getAll: 'GET /api/products',
        getOne: 'GET /api/products/:id',
        update: 'PUT /api/products/:id (Farmer only)',
        delete: 'DELETE /api/products/:id (Farmer only)',
        getByFarmer: 'GET /api/products/farmer/:farmerId',
      },
      buyerListings: {
        create: 'POST /api/buyer-listings (Buyer only)',
        getAll: 'GET /api/buyer-listings',
        getOne: 'GET /api/buyer-listings/:id',
        update: 'PUT /api/buyer-listings/:id (Buyer only)',
        delete: 'DELETE /api/buyer-listings/:id (Buyer only)',
        getMyListings: 'GET /api/buyer-listings/my-listings',
        addOffer: 'POST /api/buyer-listings/:id/offer (Farmer only)',
      },
      negotiations: {
        start: 'POST /api/negotiations/start',
        sendMessage: 'POST /api/negotiations/message',
        getByProduct: 'GET /api/negotiations/product/:productId',
        getByBuyerListing: 'GET /api/negotiations/buyer-listing/:buyerListingId',
        getById: 'GET /api/negotiations/:id',
        getByFarmer: 'GET /api/negotiations/farmer/:farmerId',
        updateStatus: 'PUT /api/negotiations/:id/status',
      },
      contracts: {
        create: 'POST /api/contracts/create',
        getByFarmer: 'GET /api/contracts/farmer/:id',
        getByBuyer: 'GET /api/contracts/buyer/:id',
        getById: 'GET /api/contracts/:id',
        sign: 'PUT /api/contracts/:id/sign',
        updateStatus: 'PUT /api/contracts/:id/status',
        getStats: 'GET /api/contracts/stats/:userId',
      },
    },
  });
});

// 404 Error Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {},
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 API URL: http://localhost:${PORT}`);
});

export default app;
