# 🚀 Quick Start Guide - Farmer Functionality

## Prerequisites
- Node.js (v14+)
- MongoDB Atlas account or local MongoDB
- npm or yarn

## Installation & Setup

### 1. Backend Setup
```bash
cd backend
npm install

# Create .env file
cat > .env << EOF
PORT=5000
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
EOF

# Start backend server
npm start
```

Expected output:
```
🚀 Server running on port 5000
📡 Environment: development
🌐 API URL: http://localhost:5000
✅ MongoDB Connected: ...
```

### 2. Frontend Setup
```bash
cd frontend
npm install

# Start development server
npm run dev
```

Expected output:
```
VITE v4.x.x ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

## Testing the Farmer Flow

### Step 1: Register as Farmer
1. Open http://localhost:5173
2. Select "Farmer"
3. Register with:
   - Name: John Farmer
   - Email: farmer@test.com
   - Password: password123
   - User Type: Farmer
4. Should auto-redirect to Farmer Dashboard

### Step 2: List a Product
1. Click "List New Product" button
2. Fill in product details:
   ```
   Name: Organic Tomatoes
   Type: Vegetables
   Description: Fresh organic tomatoes
   Location: Punjab, India
   Quantity: 500
   Unit: kg
   Price Per Unit: 40
   Harvest Date: (future date)
   Image URL: (optional)
   ```
3. Submit → Product appears on dashboard

### Step 3: View Your Products
1. Click "View My Products" or navigate to "My Products"
2. See all your listed products
3. Try Edit/Delete operations

### Step 4: Simulate Buyer Offer
For testing, you can:

**Option A: Use Postman/Thunder Client**
```http
POST http://localhost:5000/api/negotiations/start
Authorization: Bearer <buyer_jwt_token>
Content-Type: application/json

{
  "productId": "<product_id>",
  "farmerId": "<farmer_id>",
  "initialMessage": "I'm interested in buying 200kg at ₹35/kg",
  "offerDetails": {
    "price": 35,
    "quantity": 200,
    "deliveryDate": "2025-12-01",
    "terms": "Payment on delivery"
  }
}
```

**Option B: Register as Buyer**
1. Logout from farmer account
2. Register new account with User Type: Buyer
3. Browse products
4. Click "Start Negotiation" on farmer's product

### Step 5: Farmer Responds to Offer
1. Login back as farmer
2. Dashboard shows "Active Negotiations"
3. Click on negotiation → Opens chat
4. Send message or counter-offer
5. Click "Send Offer" button:
   ```
   Price: 38
   Quantity: 200
   Delivery Date: 2025-12-01
   Terms: 50% advance, 50% on delivery
   ```

### Step 6: Finalize Contract
1. After agreement in chat
2. Click "Finalize Contract"
3. Confirm in dialog
4. Contract created with status "pending"
5. Navigate to "My Contracts"

### Step 7: Sign Contract
1. View pending contract
2. Click "Sign Contract" button
3. Status updates to "active" once both parties sign

## API Testing with cURL

### Create Product
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_FARMER_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Wheat",
    "type": "Grains",
    "description": "Premium quality wheat",
    "location": "Punjab",
    "quantity": 1000,
    "unit": "kg",
    "pricePerUnit": 25,
    "harvestDate": "2025-12-15"
  }'
```

### Get Farmer Negotiations
```bash
curl -X GET http://localhost:5000/api/negotiations/farmer/YOUR_FARMER_ID \
  -H "Authorization: Bearer YOUR_FARMER_JWT"
```

### Get Farmer Contracts
```bash
curl -X GET http://localhost:5000/api/contracts/farmer/YOUR_FARMER_ID \
  -H "Authorization: Bearer YOUR_FARMER_JWT"
```

### Get Contract Stats
```bash
curl -X GET http://localhost:5000/api/contracts/stats/YOUR_FARMER_ID \
  -H "Authorization: Bearer YOUR_FARMER_JWT"
```

## Common Issues & Solutions

### Issue 1: Cannot connect to MongoDB
**Error**: `MongoNetworkError: failed to connect to server`
**Solution**: 
- Check MONGODB_URI in .env
- Verify MongoDB Atlas IP whitelist
- Ensure network connectivity

### Issue 2: JWT token invalid
**Error**: `401 Unauthorized`
**Solution**:
- Re-login to get fresh token
- Check JWT_SECRET matches in .env
- Verify token in localStorage

### Issue 3: CORS errors
**Error**: `CORS policy: No 'Access-Control-Allow-Origin'`
**Solution**:
- Backend already has CORS enabled
- Check backend is running on port 5000
- Clear browser cache

### Issue 4: Products not showing
**Solution**:
- Check browser console for errors
- Verify farmer is logged in
- Check network tab for API responses
- Ensure products exist in database

## Verification Checklist

- [ ] Backend server running (port 5000)
- [ ] Frontend dev server running (port 5173)
- [ ] MongoDB connected
- [ ] Can register as farmer
- [ ] Auto-redirects to farmer dashboard
- [ ] Dashboard shows stats (0s initially)
- [ ] Can create product
- [ ] Product appears in "My Products"
- [ ] Can edit/delete product
- [ ] Can view negotiations (empty initially)
- [ ] Can view contracts (empty initially)
- [ ] Chat interface loads
- [ ] Can send messages
- [ ] Can create contract
- [ ] Contract appears in list

## Next Steps

After verifying the farmer flow:

1. **Test Buyer Flow**: Register as buyer and test making offers
2. **Integration Testing**: Complete end-to-end negotiation
3. **Performance**: Test with multiple products and contracts
4. **Security**: Verify JWT protection on all routes
5. **UI/UX**: Test on mobile devices

## Useful MongoDB Queries

View all negotiations:
```javascript
db.negotiations.find().pretty()
```

View all contracts:
```javascript
db.contracts.find().pretty()
```

View farmer's products:
```javascript
db.products.find({ farmerId: ObjectId("YOUR_FARMER_ID") }).pretty()
```

Clear test data:
```javascript
db.negotiations.deleteMany({})
db.contracts.deleteMany({})
db.products.deleteMany({})
```

## Development Tips

1. **Hot Reload**: Frontend has hot reload enabled
2. **Backend Logs**: Check terminal for API request logs
3. **Browser DevTools**: Use Network tab to debug API calls
4. **React DevTools**: Install extension for component debugging
5. **MongoDB Compass**: Use for database visualization

## Production Deployment

Before deploying:
- [ ] Set NODE_ENV=production
- [ ] Use strong JWT_SECRET
- [ ] Enable rate limiting
- [ ] Set up proper logging
- [ ] Configure CORS for production domain
- [ ] Use environment-specific MongoDB
- [ ] Enable HTTPS
- [ ] Implement error tracking (e.g., Sentry)

---

**Need Help?** Check the FARMER_IMPLEMENTATION.md file for detailed documentation.
